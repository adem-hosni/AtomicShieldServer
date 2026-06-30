# Core Encryption Engine

## AtomicCore

`src/core/core.py` — The cryptographic backbone of the WebSocket protocol.

### Class: `AtomicCore`

Manages AES encryption/decryption for all server ↔ client communication.

### Methods

#### `load_keys(keys_paths: List[str])`
Loads AES key files into memory.

#### `load_ivs(ivs_paths: List[str])`
Loads AES initialization vectors into memory.

#### `encode(buffer) -> str`
Encrypts and base64-encodes data for transmission.

1. Converts input to bytes (supports str, dict, bytes)
2. Randomly selects one of the loaded key pairs
3. Encrypts with AES-CBC + PKCS7 padding
4. Prepends key index byte (`chr(index + 31)`)
5. Base64 encodes the result

#### `decode(buffer) -> str`
Decrypts received data.

1. Base64 decodes
2. Extracts key index from first byte
3. Selects corresponding key/IV
4. Decrypts with AES-CBC
5. Removes PKCS7 padding

### Initialization

```python
atomic_core = AtomicCore()
atomic_core.load_ivs(["../bin/debug/aes_keys/i1.bin", ..., "i8.bin"])
atomic_core.load_keys(["../bin/debug/aes_keys/k1.bin", ..., "k8.bin"])
```

Up to 255 key pairs are supported. Each pair consists of a 16-byte key and 16-byte IV stored as raw binary files.

### Key Generation

```bash
python scripts/generate_keys.py --target debug/aes_keys --count 8 --key_size 16
```

### C++ Export

For embedding the same keys into the client engine:

```bash
python scripts/dump_aes_keys_2_cpparray.py --mode debug --target k
python scripts/dump_aes_keys_2_cpparray.py --mode debug --target i
```
