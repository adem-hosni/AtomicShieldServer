call "%~dp0..\venv\Scripts\activate.bat"
cd /d "%~dp0..\src"
hypercorn AtomicShield.asgi:application -b 0.0.0.0:8000 -w 8 --keep-alive 5 --graceful-timeout 30
