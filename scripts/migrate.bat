call "%~dp0..\venv\Scripts\activate.bat"
cd /d "%~dp0..\src"

python manage.py makemigrations
python manage.py migrate
