from string import ascii_uppercase, digits
from random import shuffle
from typing import Optional


def generate_key(parts: Optional[int] = 4) -> str:
    allowed_chars = ascii_uppercase + digits
    license_key = ""

    allowed_chars = " ".join(allowed_chars).split(" ")

    # Generate 3 random parts of the key
    for i in range(parts + 1):
        shuffle(allowed_chars)
        license_key += "".join(allowed_chars)[:5] + "-"

    return license_key[:-1]
