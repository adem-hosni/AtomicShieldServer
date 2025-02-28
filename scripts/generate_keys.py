# python generate_keys.py --target production/aes_keys --count 15 --key_size 16


import argparse

import os
from pathlib import Path


parser = argparse.ArgumentParser(description="Generate AES keys")
parser.add_argument(
    "--key_size", type=str, help="Keys Size", required=True
)
parser.add_argument("--target", type=str, help="Target directory", required=True)
parser.add_argument("--count", type=str, help="How many keys", required=True)

args = parser.parse_args()

key_size = int(args.key_size)

bin_path = os.path.join(Path(__file__).parent.parent, "bin", args.target)

for i in range(0, int(args.count)):
    key_filename = f"k{i+1}.bin"
    with open(os.path.join(bin_path, key_filename), "wb") as file:
        file.write(os.urandom(key_size))
    
    iv_filename = f"i{i+1}.bin"
    with open(os.path.join(bin_path, iv_filename), "wb") as file:
        file.write(os.urandom(key_size))

print(f"Generated {args.count} AES key with size {args.key_size} bytes Successfuly!")
