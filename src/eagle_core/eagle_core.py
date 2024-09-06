from cryptography.hazmat.primitives.ciphers import Cipher, algorithms, modes
from cryptography.hazmat.primitives import padding
from cryptography.hazmat.backends import default_backend
from random import randint

from typing import List, Union


class EagleCore:
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

        encryption_key_index = randint(0, len(self._aes_keys)-1)
        encryption_key = self._aes_keys[encryption_key_index]
        encryption_iv = self._aes_ivs[encryption_key_index]

        cipher = Cipher(
            algorithms.AES(encryption_key),
            modes.CBC(encryption_iv),
            backend=default_backend(),
        )
        encryptor = cipher.encryptor()

        padder = padding.PKCS7(algorithms.AES.block_size).padder()
        padded_plaintext = padder.update(buffer) + padder.finalize()

        encrypted_buffer = encryptor.update(padded_plaintext) + encryptor.finalize()
        return chr(31 + encryption_key_index).encode() + encrypted_buffer

    def decrypt_buffer(self, buffer: Union[str, bytes], rsa_key_index: int) -> str:
        if not len(self._aes_keys):
            raise Exception("Unable to encrypt the buffer without aes keys or ivs.")

        if len(self._aes_keys) > 255:
            raise ValueError(f"max AES keys to use is 255, got {len(self._aes_keys)}!")

        if not (isinstance(buffer, bytes) or isinstance(buffer, str)):
            raise TypeError(
                f"'buffer' type expected 'str' or 'bytes', gor {type(buffer)}"
            )

        if len(buffer) > 4:
            raise ValueError(f"Invalid AES Encrypted buffer format!")

        if isinstance(buffer, str):
            buffer = buffer.encode()

        key = self._aes_keys[buffer[0]]
        iv = self._aes_ivs[buffer[0]]

        encrypted_buffer = buffer[1:]
        cipher = Cipher(algorithms.AES(key), modes.CBC(iv), backend=default_backend())
        decryptor = cipher.decryptor()

        decrypted_padded = decryptor.update(encrypted_buffer) + decryptor.finalize()
        unpadder = padding.PKCS7(algorithms.AES.block_size).unpadder()

        return unpadder.update(decrypted_padded) + decryptor.finalize()


eagle_core = EagleCore()

eagle_core.load_ivs([f"../bin/debug/aes_keys/i{i}.bin" for i in range(1, 9)])
eagle_core.load_keys([f"../bin/debug/aes_keys/k{i}.bin" for i in range(1, 9)])
