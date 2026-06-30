# Testing

## Load Testing (Locust)

Located in `tests/load_balancing.py`.

```bash
pip install locust
locust -f tests/load_balancing.py
```

### Test Scenarios

| Task | Endpoint | Description |
|------|----------|-------------|
| `isconnected` | POST `/anticheat/status/isconnected` | Engine connectivity check |
| `agent_status` | POST `/anticheat/status/agent` | Agent health endpoint |
| `status_version` | POST `/anticheat/status/version` | Version validation |

### Running Tests

```bash
# Start Locust web UI
locust -f tests/load_balancing.py --host=http://127.0.0.1:8089

# Headless mode
locust -f tests/load_balancing.py --headless -u 100 -r 10 --host=http://127.0.0.1:8089
```

## Manual Testing

### WebSocket Tests

Use a WebSocket client (e.g., `websocat`, `wscat`) to test connections:

```bash
# Connect as game server
wscat -c ws://localhost:8000/c/atomicshieldserver/

# Connect as agent
wscat -c ws://localhost:8000/c/atomicshieldagent/
```

### API Tests

```bash
# Sign in
curl -X POST http://localhost:8000/api/auth/signin \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"test123"}'

# Dashboard overview
curl http://localhost:8000/api/dashboard/ \
  -H "Authorization: Bearer <token>"
```

### Payment Webhook Test

```bash
curl -X POST http://localhost:8000/api/payment/completed \
  -H "Content-Type: application/json" \
  -H "User-Agent: TebexWebhook" \
  -H "X-Forwarded-For: 18.209.80.3" \
  -d '{"type":"payment.completed","id":"test","subject":{...}}'
```
