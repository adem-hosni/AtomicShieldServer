from random import randint
from Crypto.Cipher import AES
from Crypto.Util.Padding import pad, unpad

from typing import List, Union


class SafeCore:
    def __init__(self) -> None:
        self._aes_keys: List[bytes] = []
        self._aes_ivs: List[bytes] = []

    def load_keys(self, keys_paths: List[str]) -> None:
        for key_path in keys_paths:
            with open(key_path, "rb") as file:
                self._aes_keys.append(file.read())

    def load_ivs(self, ivs_paths: List[str]) -> None:
        for iv_path in ivs_paths:
            with open(iv_path, "rb") as file:
                self._aes_ivs.append(file.read())

    def encrypt_buffer(self, buffer: Union[str, bytes]):
        if not len(self._aes_keys):
            raise Exception("Unable to encrypt the buffer without aes keys or ivs.")

        if len(self._aes_keys) > 255:
            raise ValueError(f"max AES keys to use is 255, got {len(self._aes_keys)}!")

        if not (isinstance(buffer, bytes) or isinstance(buffer, str)):
            raise TypeError(
                f"'buffer' type expected 'str' or 'bytes', gor {type(buffer)}"
            )

        if isinstance(buffer, str):
            buffer = buffer.encode()

        encryption_key_index = randint(0, len(self._aes_keys) - 1)
        encryption_key = self._aes_keys[encryption_key_index]
        encryption_iv = self._aes_ivs[encryption_key_index]

        cipher = AES.new(encryption_key, AES.MODE_CBC, encryption_iv)
        padded_plaintext = pad(buffer, AES.block_size)

        ciphertext = cipher.encrypt(padded_plaintext)
        encryption_key_byte = chr(encryption_key_index + 31).encode()
        return encryption_key_byte + ciphertext

    def decrypt_buffer(self, buffer: Union[str, bytes]) -> str:
        if not len(self._aes_keys):
            raise Exception("Unable to encrypt the buffer without aes keys or ivs.")

        if len(self._aes_keys) > 255:
            raise ValueError(f"max AES keys to use is 255, got {len(self._aes_keys)}!")

        if not (isinstance(buffer, bytes) or isinstance(buffer, str)):
            raise TypeError(
                f"'buffer' type expected 'str' or 'bytes', gor {type(buffer)}"
            )

        encryption_key_index = buffer[0] - 31
        key = self._aes_keys[encryption_key_index]
        iv = self._aes_ivs[encryption_key_index]

        encrypted_buffer = buffer[1:]

        cipher = AES.new(key, AES.MODE_CBC, iv)
        padded_plaintext = cipher.decrypt(encrypted_buffer)
        plaintext = unpad(padded_plaintext, AES.block_size)

        return plaintext.decode()


safe_core = SafeCore()

# eagle_core.load_ivs([f"../bin/debug/aes_keys/i{i}.bin" for i in range(1, 9)])
# eagle_core.load_keys([f"../bin/debug/aes_keys/k{i}.bin" for i in range(1, 9)])

safe_core.load_ivs(["../bin/debug/aes_keys/i1.bin"])
safe_core.load_keys(["../bin/debug/aes_keys/k1.bin"])
