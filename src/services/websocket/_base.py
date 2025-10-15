import logging
from asgiref.sync import async_to_sync
from datetime import datetime, timedelta
from ._redis import RedisConnectionManager
import asyncio
from typing import List, Union, Any, Dict, Optional
from django.conf import settings

from anticheat.consumers.atomic_server import AtomicServerConsumer
from anticheat.models import HWID
from anticheat.consumers.atomic_engine import AtomicEngineConsumer
from shared.enums import WebSocketGroupNames
import utils

logger = logging.getLogger(__name__)


class _ConnectionManager(object):
    """
    Optimized ConnectionManager:
    - Uses a single periodic refresh from Redis instead of per-entry heartbeat checks.
    - Maintains quick indices for lookups by hwid and ip to avoid scanning the cache.
    - Minimizes lock hold time: lock only when mutating cache or rebuilding indices.
    """

    _instance = None

    def __new__(cls):
        if cls._instance is None:
            cls._instance = super().__new__(cls)
            cls._instance._initialized = False
        return cls._instance

    def __init__(self) -> None:
        if self._initialized:
            return

        self.redis_manager = RedisConnectionManager(settings.REDIS_URL)

        # Main in-memory caches (channel_name -> (engine_obj, last_validation))
        self._engine_cache: Dict[str, tuple] = {}
        self._server_cache: Dict[str, tuple] = {}

        # Fast lookup indices derived from `_engine_cache`
        self._engine_by_hwid: Dict[str, AtomicEngineConsumer] = {}
        self._engine_by_ip: Dict[str, AtomicEngineConsumer] = {}

        # control
        self._validation_interval = 5  # seconds
        self._last_refresh: Optional[datetime] = None
        self._cache_lock = asyncio.Lock()
        self._initialized = True

    # -------------------------
    # Internal helpers
    # -------------------------
    async def _maybe_refresh_cache(self) -> None:
        """
        Refresh the in-memory cache from Redis if the validation interval elapsed.
        This avoids per-entry heartbeats and reduces Redis round trips.
        """
        now = datetime.now()
        if self._last_refresh and (now - self._last_refresh).total_seconds() < self._validation_interval:
            return

        # Acquire lock only for the refresh/rebuild operation
        async with self._cache_lock:
            # re-check after acquiring lock
            now = datetime.now()
            if self._last_refresh and (now - self._last_refresh).total_seconds() < self._validation_interval:
                return

            try:
                # Get all active engines and servers from redis in one call each.
                redis_engines = await self.redis_manager.get_all_engines()
                redis_servers = await self.redis_manager.get_all_servers()

                active_engine_channels = {d.get("channel_name") for d in redis_engines if d.get("channel_name")}
                active_server_channels = {d.get("channel_name") for d in redis_servers if d.get("channel_name")}

                # Prune engines not present in Redis (they are stale)
                for channel in list(self._engine_cache.keys()):
                    if channel not in active_engine_channels:
                        self._engine_cache.pop(channel, None)

                # Update last_validation timestamp for engines present in Redis
                now = datetime.now()
                for channel in list(self._engine_cache.keys()):
                    engine, _ = self._engine_cache[channel]
                    self._engine_cache[channel] = (engine, now)

                # Prune servers not present in Redis
                for channel in list(self._server_cache.keys()):
                    if channel not in active_server_channels:
                        self._server_cache.pop(channel, None)

                for channel in list(self._server_cache.keys()):
                    server, _ = self._server_cache[channel]
                    self._server_cache[channel] = (server, now)

                # Rebuild fast indices from the remaining in-memory engine objects
                self._rebuild_indices_locked()

                self._last_refresh = now
            except Exception as e:
                logger.exception("Error refreshing connection cache from Redis: %s", e)

    def _rebuild_indices_locked(self) -> None:
        """
        Rebuild indices from current _engine_cache.
        Must be called while holding _cache_lock.
        """
        self._engine_by_hwid.clear()
        self._engine_by_ip.clear()

        for engine, _ in self._engine_cache.values():
            try:
                if getattr(engine, "hwid", None) and getattr(engine.hwid, "id", None):
                    hwid_str = str(engine.hwid.id)
                    self._engine_by_hwid[hwid_str] = engine

                # primary address
                if getattr(engine, "address", None) and engine.address:
                    ip = engine.address[0]
                    self._engine_by_ip[ip] = engine

                # any received IPs
                if getattr(engine, "received_ip", None):
                    for rip in engine.received_ip:
                        self._engine_by_ip[rip] = engine
            except Exception:
                # avoid a single bad engine killing index rebuild
                logger.exception("Error indexing engine %r", engine)

    # -------------------------
    # Public API (async)
    # -------------------------
    async def get_engines(self) -> List[AtomicEngineConsumer]:
        await self._maybe_refresh_cache()
        # return a snapshot (no lock held)
        async with self._cache_lock:
            return [engine for engine, _ in self._engine_cache.values()]

    async def get_servers(self) -> List[AtomicServerConsumer]:
        await self._maybe_refresh_cache()
        async with self._cache_lock:
            return [server for server, _ in self._server_cache.values()]

    async def add_atomic_server(self, server: Union[AtomicServerConsumer, Any]) -> bool:
        if server.group_name != WebSocketGroupNames.SAFE_SERVERS.value:
            return False

        async with self._cache_lock:
            self._server_cache[server.channel_name] = (server, datetime.now())

        server_data = self._server_to_dict(server)
        return await self.redis_manager.add_server(server_data)

    async def is_server_running(self, server_ip: str) -> bool:
        await self._maybe_refresh_cache()

        # check in-memory index quickly
        async with self._cache_lock:
            for server, _ in self._server_cache.values():
                if server.address and server.address[0] == server_ip:
                    return True

        # fallback to Redis
        servers = await self.redis_manager.get_all_servers()
        for server_data in servers:
            if server_data.get("address", [""])[0] == server_ip:
                return True
        return False

    async def add_engine(self, scanner: AtomicEngineConsumer) -> bool:
        if scanner.group_name != WebSocketGroupNames.SAFE_ENGINES.value:
            return False

        async with self._cache_lock:
            self._engine_cache[scanner.channel_name] = (scanner, datetime.now())
            # update indices incrementally to avoid a full rebuild
            try:
                if getattr(scanner, "hwid", None) and getattr(scanner.hwid, "id", None):
                    self._engine_by_hwid[str(scanner.hwid.id)] = scanner
                if getattr(scanner, "address", None) and scanner.address:
                    self._engine_by_ip[scanner.address[0]] = scanner
                if getattr(scanner, "received_ip", None):
                    for rip in scanner.received_ip:
                        self._engine_by_ip[rip] = scanner
            except Exception:
                logger.exception("Error while indexing added engine %r", scanner)

        engine_data = self._engine_to_dict(scanner)
        return await self.redis_manager.add_engine(engine_data)

    async def remove_atomic_server(self, server: AtomicServerConsumer) -> bool:
        async with self._cache_lock:
            self._server_cache.pop(server.channel_name, None)
        return await self.redis_manager.remove_server(server.channel_name)

    async def remove_safe_scanner(self, scanner: AtomicEngineConsumer) -> bool:
        async with self._cache_lock:
            removed = self._engine_cache.pop(scanner.channel_name, None)
            # If removed, also remove index entries that pointed to it
            if removed:
                # rebuild indices cheaply to ensure consistency
                self._rebuild_indices_locked()

        return await self.redis_manager.remove_engine(scanner.channel_name)

    async def is_engine_connected(self, scanner_ip: str) -> bool:
        return bool(await self.get_engine_by_ip(scanner_ip))

    async def is_engine_connected_by_hwid(self, hwid: HWID) -> bool:
        return bool(await self.get_scanner_by_hwid(hwid))

    async def get_engine_by_steam(self, steam: str) -> Optional[AtomicEngineConsumer]:
        try:
            if not steam or steam.lower() == "unknown":
                logger.debug(f"get_engine_by_steam() called with invalid steam='{steam}'")
                return None

            logger.debug(f"get_engine_by_steam(): looking up steam='{steam}' in HWID DB")

            # Try to fetch HWID from DB
            target_hwid = (
                await HWID.objects.filter(steam=steam)
                .order_by("-last_seen")
                .afirst()
            )

            if not target_hwid:
                logger.debug(f"get_engine_by_steam(): no HWID entry found in DB for steam='{steam}'")
                return None

            logger.debug(
                f"get_engine_by_steam(): found HWID in DB for steam='{steam}' "
                f"(username='{target_hwid.username}', id={target_hwid.id})"
            )

            # Try to map HWID -> active engine
            engine = await self.get_scanner_by_hwid(target_hwid)
            if engine:
                logger.debug(
                    f"get_engine_by_steam(): mapped HWID id={target_hwid.id} "
                    f"to active engine at {engine.address}"
                )
                return engine
            else:
                logger.debug(
                    f"get_engine_by_steam(): HWID id={target_hwid.id} found, "
                    f"but no active engine connection (agent might not be running)"
                )
                return None

        except Exception as err:
            logger.error(
                f"❌ get_engine_by_steam(): error while retrieving engine by steam='{steam}': {err}"
            )
            return None

    # function to retreive multiple engines by 24subnet or partial ip match
    async def get_multiple_engines_by_24subnet(self, ip) -> List[AtomicEngineConsumer]:
        await self._maybe_refresh_cache()
        found_engines = []
        async with self._cache_lock:
            for engine, _ in self._engine_cache.values():
                try:
                    if getattr(engine, "address", None) and engine.address and utils.is_same_subnet_24(ip, engine.address[0]):
                        found_engines.append(engine)
                except Exception:
                    continue
        return found_engines


    async def get_multiple_engines_by_ip(self, ip) -> List[AtomicEngineConsumer]:
        await self._maybe_refresh_cache()
        found_engines = []
        async with self._cache_lock:
            for engine, _ in self._engine_cache.values():
                try:
                    if (getattr(engine, "address", None) and engine.address and engine.address[0] in ip) or (
                        getattr(engine, "received_ip", None) and any(rip in ip for rip in engine.received_ip)
                    ):
                        found_engines.append(engine)
                except Exception:
                    continue
        return found_engines

        if found_engines:
            return found_engines

        # Redis fallback
        engines = await self.redis_manager.get_all_engines()
        for engine_data in engines:
            address = engine_data.get("address", [""])
            received_ip = engine_data.get("received_ip", [])
            if (address and address[0] in ip) or any(rip in ip for rip in received_ip):
                channel_name = engine_data.get("channel_name")
                async with self._cache_lock:
                    engine = self._engine_cache.get(channel_name, (None, None))[0]
                    if engine and engine not in found_engines:
                        found_engines.append(engine)

        return found_engines

    async def get_engine_by_ip(self, scanner_ip: str) -> Optional[AtomicEngineConsumer]:
        await self._maybe_refresh_cache()

        # fast map lookup under lock for snapshot consistency
        async with self._cache_lock:
            engine = self._engine_by_ip.get(scanner_ip)
            if engine:
                return engine

            # fallback: iterate in-memory small cache (rare)
            for eng, _ in self._engine_cache.values():
                if (getattr(eng, "address", None) and eng.address and eng.address[0] == scanner_ip) or (
                    getattr(eng, "received_ip", None) and scanner_ip in eng.received_ip
                ):
                    return eng

        # Redis fallback: return in-memory instance if channel present (can't construct engine object from Redis-only data)
        engines = await self.redis_manager.get_all_engines()
        for engine_data in engines:
            address = engine_data.get("address", [""])
            received_ip = engine_data.get("received_ip", [])
            if (address and address[0] == scanner_ip) or (scanner_ip in received_ip):
                channel_name = engine_data.get("channel_name")
                async with self._cache_lock:
                    return self._engine_cache.get(channel_name, (None, None))[0]

        return None

    async def get_engine_by_24subnet(self, ip: str) -> Optional[AtomicEngineConsumer]:
        await self._maybe_refresh_cache()
        async with self._cache_lock:
            # quick in-memory scan (cache expected to be small)
            for engine, _ in self._engine_cache.values():
                try:
                    if utils.is_same_subnet_24(ip, engine.address[0]):
                        return engine
                except Exception:
                    continue

        # Redis fallback
        engines = await self.redis_manager.get_all_engines()
        for engine_data in engines:
            address = engine_data.get("address", [""])
            if address and utils.is_same_subnet_24(ip, address[0]):
                channel_name = engine_data.get("channel_name")
                async with self._cache_lock:
                    return self._engine_cache.get(channel_name, (None, None))[0]
        return None

    async def get_scanner_by_hwid(self, hwid: HWID, only_in_memory: Optional[bool] = False) -> Optional[AtomicEngineConsumer]:
        await self._maybe_refresh_cache()
        hwid_str = str(hwid.id)

        async with self._cache_lock:
            engine = self._engine_by_hwid.get(hwid_str)
            if engine:
                return engine
        
        if only_in_memory:
            return None

        # Redis fallback
        engines = await self.redis_manager.get_all_engines()
        for engine_data in engines:
            if engine_data.get("hwid") == hwid_str:
                channel_name = engine_data.get("channel_name")
                async with self._cache_lock:
                    return self._engine_cache.get(channel_name, (None, None))[0]
        return None

    async def aget_server_by_ip(self, server_ip: str) -> Optional[AtomicServerConsumer]:
        await self._maybe_refresh_cache()
        async with self._cache_lock:
            for server, _ in self._server_cache.values():
                if server.address and server.address[0] == server_ip:
                    return server

        servers = await self.redis_manager.get_all_servers()
        for server_data in servers:
            address = server_data.get("address", [""])
            if address and address[0] == server_ip:
                channel_name = server_data.get("channel_name")
                async with self._cache_lock:
                    return self._server_cache.get(channel_name, (None, None))[0]
        return None

    def get_server_by_ip(self, server_ip: str) -> Optional[AtomicServerConsumer]:
        return async_to_sync(self.aget_server_by_ip)(server_ip)

    async def atotal_engines(self) -> int:
        return await self.redis_manager.get_engine_count()

    def total_engines(self) -> int:
        return async_to_sync(self.redis_manager.get_engine_count)()

    async def atotal_servers(self) -> int:
        return await self.redis_manager.get_server_count()

    def total_servers(self) -> int:
        return async_to_sync(self.redis_manager.get_server_count)()

    # -------------------------
    # Serializers (unchanged)
    # -------------------------
    def _engine_to_dict(self, engine: AtomicEngineConsumer) -> Dict:
        """Convert engine to serializable dict"""
        try:
            hwid_val = None
            if getattr(engine, "hwid", None) and getattr(engine.hwid, "id", None):
                hwid_val = str(engine.hwid.id)
        except Exception:
            hwid_val = None

        return {
            "channel_name": getattr(engine, "channel_name", None),
            "address": getattr(engine, "address", None),
            "received_ip": getattr(engine, "received_ip", None),
            "hwid": hwid_val,
            "group_name": getattr(engine, "group_name", None),
        }

    def _server_to_dict(self, server: AtomicServerConsumer) -> Dict:
        """Convert server to serializable dict"""
        return {
            "channel_name": getattr(server, "channel_name", None),
            "address": getattr(server, "address", None),
            "group_name": getattr(server, "group_name", None),
        }
