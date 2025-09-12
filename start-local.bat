@echo off
echo ========================================
echo   DevOps AI Agent - Inicio Local
echo ========================================

echo.
echo Verificando configuración...
node verify-config.js
if %errorlevel% neq 0 (
    echo.
    echo ❌ Configuración incompleta
    echo Por favor completa las variables de entorno
    pause
    exit /b 1
)

echo.
echo ========================================
echo   Iniciando servicios...
echo ========================================

echo.
echo 🚀 Para iniciar el agente completo:
echo.
echo 1. BACKEND (Terminal 1):
echo    cd backend
echo    npm run dev
echo.
echo 2. FRONTEND (Terminal 2):
echo    cd frontend  
echo    npm run dev
echo.
echo 3. TESTING (Terminal 3):
echo    node test-complete.js
echo.
echo 4. ACCEDER:
echo    Frontend: http://localhost:5173
echo    Backend:  http://localhost:3001
echo.
echo ========================================
pause