# Utility Scripts

## generate_keys.py

Generates AES encryption keys for the WebSocket protocol.

```bash
python scripts/generate_keys.py --target debug/aes_keys --count 8 --key_size 16
```

**Arguments:**
| Arg | Description |
|-----|-------------|
| `--target` | Output directory (e.g., `debug/aes_keys` or `production/aes_keys`) |
| `--count` | Number of key pairs to generate |
| `--key_size` | Key size in bytes (16 for AES-128, 32 for AES-256) |

Generates `k1.bin`...`kN.bin` (keys) and `i1.bin`...`iN.bin` (IVs).

## dump_aes_keys_2_cpparray.py

Converts AES keys to C++ byte arrays for embedding in the client engine.

```bash
python scripts/dump_aes_keys_2_cpparray.py --mode debug --target k
```

**Arguments:**
| Arg | Description |
|-----|-------------|
| `--mode` | Key mode: `debug` or `production` |
| `--target` | File prefix: `k` for keys, `i` for IVs |

## migrate.bat

Windows batch script to run Django migrations:

```bat
python src/manage.py makemigrations
python src/manage.py migrate
```

## runserver.bat

Windows batch script for development:

```bat
python src/manage.py runserver
```
