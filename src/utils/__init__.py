import re
import logging
from string import ascii_uppercase, digits
from random import shuffle
from typing import Optional, Dict, Any
from datetime import timedelta


logger = logging.getLogger(__name__)


def generate_key(parts: Optional[int] = 4) -> str:
    """
    Generate a random license key consisting of uppercase letters and digits.

    The function generates a license key with a specified number of parts (default is 4),
    where each part consists of 5 randomly shuffled characters (uppercase letters and digits),
    separated by hyphens. For example, a key with 4 parts will have the format 'XXXXX-XXXXX-XXXXX-XXXXX'.

    Args:
    -----
        parts (Optional[int]): The number of parts in the license key. Default is 4, which results in
                               5 characters in each part and 4 parts separated by hyphens. If `parts=4`,
                               the key will contain 5 parts (due to the loop structure adding one extra part).

    Returns:
    --------
        str: A randomly generated license key in the format of multiple parts separated by hyphens.

    Notes:
    ------
        - The function uses the `shuffle` method to randomly rearrange characters in each part.
        - The result is trimmed at the end to remove the trailing hyphen.
    """
    allowed_chars = list(ascii_uppercase + digits)
    license_key = ""

    # Generate 3 random parts of the key
    for _ in range(parts):
        shuffle(allowed_chars)
        license_key += "".join(allowed_chars)[:5] + "-"

    return license_key[:-1]


def check_request_body_key(
    request_body: Dict[str, Any], target_key: str, key_type: type
) -> bool:
    """Check a key in a request body

    Args:
    -----
        request_body (Dict[str, Any]): The request body
        target_key (str): The key to check
        key_type (type): The key type

    Returns:
    --------
        bool: True if the key exists and it's type comptatible else False
    """
    if not target_key in request_body.keys():
        logger.warning(f"{target_key} Not Found in request. (given request: {request_body})")
        return False

    if not isinstance(request_body[target_key], key_type):
        logger.warning(
            f"'{target_key}''s type isn't comptatible with {key_type} (got: {request_body[target_key]})"
        )
        return False
    return True


def represent_timedelta_string(time: timedelta) -> str:
    result = ""

    days = time.days
    total_seconds = time.seconds
    hours = total_seconds // 3600
    minutes = (total_seconds % 3600) // 60

    if days > 0:
        result += f"{days} days "
    if hours > 0:
        result += f"{hours}h "
    if minutes > 0:
        result += f"{minutes}mn "

    return result[:-1]


def isvalid_ip(ip: str) -> bool:
    """
    Validate if the given string is a valid IPv4 address.

    An IPv4 address consists of four decimal numbers, each ranging from 0 to 255, separated by dots.
    This function checks if the provided IP address follows the correct format and is within the allowed range.

    Args:
    -----
        ip (str): The string representing an IPv4 address.

    Returns:
    --------
        bool: True if the provided string is a valid IPv4 address, otherwise False.

    Notes:
    ------
        This function uses a regular expression to validate the IPv4 address. The regular expression allows
        for addresses like '0.0.0.0' or '255.255.255.255', and enforces each segment to be in the range 0-255.
    """
    ipv4_pattern = re.compile(
        r"^((25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$"
    )
    return ipv4_pattern.match(ip)
