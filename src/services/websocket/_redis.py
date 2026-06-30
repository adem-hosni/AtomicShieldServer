import logging
import json
from typing import List, Dict, Optional
from datetime import datetime
from contextlib import asynccontextmanager
import redis.asyncio as redis

logger = logging.getLogger(__name__)


class RedisConnectionManager:
    """Manages Redis connections and operations with heartbeat validation"""

    _instance = None

    def __new__(cls, *args, **kwargs):
        if cls._instance is None:
            cls._instance = super().__new__(cls)
            cls._instance._initialized = False
        return cls._instance

    def __init__(self, redis_url: str):
        if self._initialized:
            return
        self.redis_url = redis_url
        self.redis_client = redis.from_url(
            redis_url, decode_responses=True, retry_on_timeout=True
        )
        self.engine_key = "atomicshield:engines"
        self.server_key = "atomicshield:servers"
        self.heartbeat_key = "atomicshield:heartbeats"
        self.lock_key_prefix = "atomicshield:lock:"
        self._initialized = True

    def get_client(self):
        if not self.redis_client:
            self.redis_client = redis.from_url(
                self.redis_url, decode_responses=True, retry_on_timeout=True
            )
        return self.redis_client

    @asynccontextmanager
    async def acquire_lock(self, lock_name, timeout=10):
        """Acquire a distributed lock"""
        lock = self.redis_client.lock(
            f"{self.lock_key_prefix}{lock_name}", timeout=timeout
        )
        try:
            acquired = await lock.acquire(blocking=True, blocking_timeout=5)
            if acquired:
                yield
            else:
                raise Exception(f"Could not acquire lock {lock_name}")
        finally:
            await lock.release()

    async def add_engine(self, engine_data: Dict) -> bool:
        """Add an engine to Redis with heartbeat"""
        try:
            engine_id = engine_data["channel_name"]
            # Use transaction to ensure atomicity
            async with self.redis_client.pipeline(transaction=True) as pipe:
                pipe.hset(self.engine_key, engine_id, json.dumps(engine_data))
                pipe.hset(self.heartbeat_key, engine_id, datetime.now().isoformat())
                await pipe.execute()
            return True
        except Exception as e:
            logger.error(f"Error adding engine to Redis: {e}")
            return False

    async def update_heartbeat(self, channel_name: str) -> bool:
        """Update the heartbeat for a connection"""
        try:
            await self.redis_client.hset(
                self.heartbeat_key, channel_name, datetime.now().isoformat()
            )
            return True
        except Exception as e:
            logger.error(f"Error updating heartbeat: {e}")
            return False

    async def is_connection_active(
        self, channel_name: str, max_age_seconds: int = 30
    ) -> bool:
        """Check if a connection is still active based on heartbeat"""
        try:
            heartbeat_str = await self.redis_client.hget(
                self.heartbeat_key, channel_name
            )
            if not heartbeat_str:
                return False

            heartbeat_time = datetime.fromisoformat(heartbeat_str)
            return (datetime.now() - heartbeat_time).total_seconds() < max_age_seconds
        except Exception as e:
            logger.error(f"Error checking connection activity: {e}")
            return False

    async def remove_engine(self, channel_name: str) -> bool:
        """Remove an engine from Redis"""
        try:
            pipe = self.redis_client.pipeline(transaction=True)
            pipe.hdel(self.engine_key, channel_name)
            pipe.hdel(self.heartbeat_key, channel_name)
            await pipe.execute()
            return True
        except Exception as e:
            logger.error(f"Error removing engine from Redis: {e}")
            return False

    async def get_engine(self, channel_name: str) -> Optional[Dict]:
        """Get an engine by channel name with activity check"""
        try:
            if not await self.is_connection_active(channel_name):
                await self.remove_engine(channel_name)
                return None

            engine_data = await self.redis_client.hget(self.engine_key, channel_name)
            return json.loads(engine_data) if engine_data else None
        except Exception as e:
            logger.error(f"Error getting engine from Redis: {e}")
            return None

    async def get_all_engines(self) -> List[Dict]:
        """Get all active engines from Redis"""
        try:
            engines = []
            all_engines = await self.redis_client.hgetall(self.engine_key)

            for channel_name, engine_data in all_engines.items():
                if await self.is_connection_active(channel_name):
                    engines.append(json.loads(engine_data))
                else:
                    await self.remove_engine(channel_name)
            return engines
        except Exception as e:
            logger.error(f"Error getting all engines from Redis: {e}")
            return []

    async def add_server(self, server_data: Dict) -> bool:
        """Add a server to Redis with heartbeat"""
        try:
            server_id = server_data["channel_name"]
            async with self.redis_client.pipeline(transaction=True) as pipe:
                pipe.hset(self.server_key, server_id, json.dumps(server_data))
                pipe.hset(self.heartbeat_key, server_id, datetime.now().isoformat())
                await pipe.execute()
            return True
        except Exception as e:
            logger.error(f"Error adding server to Redis: {e}")
            return False

    async def remove_server(self, channel_name: str) -> bool:
        """Remove a server from Redis"""
        try:
            async with self.redis_client.pipeline(transaction=True) as pipe:
                pipe.hdel(self.server_key, channel_name)
                pipe.hdel(self.heartbeat_key, channel_name)
                await pipe.execute()
            return True
        except Exception as e:
            logger.error(f"Error removing server from Redis: {e}")
            return False

    async def get_server(self, channel_name: str) -> Optional[Dict]:
        """Get a server by channel name with activity check"""
        try:
            if not await self.is_connection_active(channel_name):
                await self.remove_server(channel_name)
                return None

            server_data = await self.redis_client.hget(self.server_key, channel_name)
            return json.loads(server_data) if server_data else None
        except Exception as e:
            logger.error(f"Error getting server from Redis: {e}")
            return None

    async def get_all_servers(self) -> List[Dict]:
        """Get all active servers from Redis"""
        try:
            servers = []
            client = self.get_client()
            all_servers = await client.hgetall(self.server_key)

            for channel_name, server_data in all_servers.items():
                if await self.is_connection_active(channel_name):
                    servers.append(json.loads(server_data))
                else:
                    await self.remove_server(channel_name)

            return servers
        except Exception as e:
            logger.error(f"Error getting all servers from Redis: {e}")
            return []

    async def clear_all(self):
        """Clear all connection data (use with caution)"""
        try:
            logger.debug(f"Clearing redis old data...")
            await self.redis_client.delete(
                self.engine_key, self.server_key, self.heartbeat_key
            )
        except Exception as e:
            logger.error(f"Error clearing Redis data: {e}")

    async def get_engine_count(self) -> int:
        """Get the count of active engines"""
        try:
            engines = await self.get_all_engines()
            return len(engines)
        except Exception as e:
            logger.error(f"Error getting engine count: {e}")
            return 0

    async def get_server_count(self) -> int:
        """Get the count of active servers"""
        try:
            servers = await self.get_all_servers()
            return len(servers)
        except Exception as e:
            logger.error(f"Error getting server count: {e}")
            return 0
