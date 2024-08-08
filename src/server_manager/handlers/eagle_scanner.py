from ..consumers.eagle_scanner import EagleScanner
from shared.ws import WebSocketGroupNames, EagleScannerPacketID
from utils import check_request_body_key
from asgiref.sync import sync_to_async
from ..models import MaliciousSignatures, ServerTypes
from typing import Dict, Any
import logging


logger = logging.getLogger(__name__)


async def handle_network_join(consumer: EagleScanner, request: Dict[str, Any]):
    logger.warning(
        f"{consumer.address[0]}:{consumer.address[1]} agent asking for network join..."
    )
    consumer.group_name = WebSocketGroupNames.EAGLE_CLIENTSCANNER.value
    consumer.channel_layer.group_add(consumer.group_name, consumer.channel_name)
    logger.info(
        f"{consumer.address[0]}:{consumer.address[1]} agent joined network successfuly!"
    )


async def handle_signatures_sync(consumer: EagleScanner, request: Dict[str, Any]):
    signatures = await sync_to_async(list)(
        MaliciousSignatures.objects.filter(type=ServerTypes.MTASA).order_by("priority")
    )
    await consumer.send(
        {
            "type": EagleScannerPacketID.SYNC_SIGNATURES.value,
            "signatures": {
                signature.name: signature.signatures for signature in signatures
            },
        }
    )
    logger.info(
        f"{consumer.address[0]}:{consumer.address[1]} Signatures Synced Successfuly!"
    )


async def handle_malicious_signature_detected(
    consumer: EagleScanner, request: Dict[str, Any]
):
    print("Yeeeee")
    ...
