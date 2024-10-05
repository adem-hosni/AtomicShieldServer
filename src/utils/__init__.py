from string import ascii_uppercase, digits
from random import shuffle
from typing import Optional, Dict, Any
from datetime import timedelta


def generate_key(parts: Optional[int] = 4) -> str:
    allowed_chars = list(ascii_uppercase + digits)
    license_key = ""

    # Generate 3 random parts of the key
    for i in range(parts + 1):
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
        print(f"{target_key} Not Found in request. (given request: {request_body})")
        return False

    if not isinstance(request_body[target_key], key_type):
        print(f"'{target_key}''s type isn't comptatible with {key_type}")
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
