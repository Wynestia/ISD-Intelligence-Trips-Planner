@echo off

echo Creating virtual environment...

python -m venv .venv

echo Activating virtual environment...
call .venv\Scripts\activate

echo Installing dependencies...
pip install --upgrade pip
pip install -r requirements.txt

echo.
echo Setup complete.
echo To activate later use:
echo .venv\Scripts\activate