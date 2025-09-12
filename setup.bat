@echo off
echo ========================================
echo   DevOps AI Agent - Setup Script
echo ========================================

echo.
echo Installing Backend dependencies...
cd backend
call npm install
if %errorlevel% neq 0 (
    echo Error installing backend dependencies
    pause
    exit /b 1
)

echo.
echo Installing Frontend dependencies...
cd ..\frontend
call npm install
if %errorlevel% neq 0 (
    echo Error installing frontend dependencies
    pause
    exit /b 1
)

echo.
echo Setup completed successfully!
echo.
echo Next steps:
echo 1. Configure your .env file in the backend folder
echo 2. Set up your Supabase database using database/schema.sql
echo 3. Run 'npm run dev' in both backend and frontend folders
echo.
pause