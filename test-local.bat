@echo off
echo ========================================
echo   DevOps AI Agent - Local Testing
echo ========================================

echo.
echo Checking if backend is running...
curl -s http://localhost:3001/health > nul
if %errorlevel% neq 0 (
    echo ❌ Backend not running. Please start with: cd backend && npm run dev
    pause
    exit /b 1
)

echo ✅ Backend is running

echo.
echo Checking if frontend is running...
curl -s http://localhost:5173 > nul
if %errorlevel% neq 0 (
    echo ❌ Frontend not running. Please start with: cd frontend && npm run dev
    pause
    exit /b 1
)

echo ✅ Frontend is running

echo.
echo Running API tests...
node test-api.js

echo.
echo ========================================
echo   Testing completed!
echo   
echo   Frontend: http://localhost:5173
echo   Backend:  http://localhost:3001
echo ========================================
pause