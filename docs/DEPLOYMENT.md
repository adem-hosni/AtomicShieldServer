# Deployment

## Production Setup

### Requirements

- Ubuntu 22.04+ (recommended)
- Python 3.11+
- MySQL 8+
- Nginx (reverse proxy)
- Supervisor (process management)

### Environment Variables

Create `.env` in project root:

```env
DJANGO_SETTINGS_MODULE=AtomicShield.settings
SECRET_KEY=your-secret-key
DEBUG=False
DB_NAME=atomicshield
DB_USER=root
DB_PASSWORD=your-password
DB_HOST=localhost
```

### Gunicorn Configuration

See `config/gunicorn_config.py`:

```python
command = "/home/ubuntu/AtomicShieldServer/venv/bin/gunicorn"
pythonpath = "/home/ubuntu/AtomicShieldServer/src"
bind = "0.0.0.0:8000"
workers = 4
```

### Daphne (ASGI/WebSocket)

For production WebSocket support, use Daphne alongside Gunicorn:

```bash
daphne -b 0.0.0.0 -p 8001 AtomicShield.asgi:application
```

### Nginx Configuration

```nginx
upstream django {
    server 127.0.0.1:8000;
}

upstream daphne {
    server 127.0.0.1:8001;
}

server {
    listen 80;
    server_name atomic-shield.com;

    location /static/ {
        alias /home/ubuntu/AtomicShieldServer/src/staticfiles/;
    }

    location /media/ {
        alias /home/ubuntu/AtomicShieldServer/src/media/;
    }

    location /c/ {
        proxy_pass http://daphne;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
    }

    location /ws/ {
        proxy_pass http://daphne;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
    }

    location / {
        proxy_pass http://django;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}
```

### Supervisor Config

```ini
[program:atomicshield]
command=/home/ubuntu/AtomicShieldServer/venv/bin/gunicorn -c /home/ubuntu/AtomicShieldServer/config/gunicorn_config.py AtomicShield.wsgi:application
directory=/home/ubuntu/AtomicShieldServer/src
user=ubuntu
autostart=true
autorestart=true
stderr_logfile=/home/ubuntu/AtomicShieldServer/logs/gunicorn.err.log
stdout_logfile=/home/ubuntu/AtomicShieldServer/logs/gunicorn.out.log

[program:atomicshield-daphne]
command=/home/ubuntu/AtomicShieldServer/venv/bin/daphne -b 0.0.0.0 -p 8001 AtomicShield.asgi:application
directory=/home/ubuntu/AtomicShieldServer/src
user=ubuntu
autostart=true
autorestart=true
stderr_logfile=/home/ubuntu/AtomicShieldServer/logs/daphne.err.log
stdout_logfile=/home/ubuntu/AtomicShieldServer/logs/daphne.out.log
```
