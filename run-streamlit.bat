@echo off
REM Neon Vault - Streamlit Launcher (Windows)

echo.
echo 0x00 Neon Vault - Escape Room
echo ================================
echo.

REM Check if .env exists
if not exist .env (
    echo WARNING: .env file not found!
    echo.
    
    if exist .env.example (
        echo Creating .env from template...
        copy .env.example .env
        echo.
        echo SUCCESS: Created .env file
        echo WARNING: Please edit .env and add your GOOGLE_API_KEY
        echo.
        pause
        exit /b 1
    ) else (
        echo ERROR: .env.example not found!
        pause
        exit /b 1
    )
)

REM Check for GOOGLE_API_KEY
findstr /M "GOOGLE_API_KEY" .env >nul
if errorlevel 1 (
    echo ERROR: GOOGLE_API_KEY not found in .env file!
    pause
    exit /b 1
)

REM Install dependencies if needed
python -c "import streamlit" >nul 2>&1
if errorlevel 1 (
    echo.
    echo INSTALLING: Python dependencies...
    pip install -r requirements.txt
    echo.
)

REM Launch Streamlit
echo.
echo LAUNCHING: Streamlit app...
echo BROWSER: Open http://localhost:8501 in your browser
echo.

streamlit run streamlit_app.py

pause
