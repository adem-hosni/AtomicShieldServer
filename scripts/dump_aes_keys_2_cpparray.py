import argparse

import os
from pathlib import Path


parser = argparse.ArgumentParser(description="Dump AES256 keys to C++ array")
parser.add_argument(
    "--mode", type=str, help="Keys Mode (debug/production)", required=True
)
parser.add_argument("--target", type=str, help="Target enumerated files", required=True)

args = parser.parse_args()

bin_path = os.path.join(Path(__file__).parent.parent, "bin", args.mode, "aes_keys")

result = ""

for filename in os.listdir(bin_path):
    if filename.endswith(".bin") and filename.startswith(args.target):
        with open(os.path.join(bin_path, filename), "rb") as file:
            buffer = file.read()
        buffer_array = ["0x" + hex(byte)[2:].upper() for byte in buffer]
        result += "{" + ", ".join(buffer_array) + "},\n"

print(result[:-1])
