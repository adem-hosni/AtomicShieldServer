call "%~dp0..\venv\Scripts\activate.bat"
cd /d "%~dp0..\src"
python manage.py runserver [::]:8000