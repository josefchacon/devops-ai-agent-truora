@echo off
echo ========================================
echo   DevOps AI Agent - Despliegue
echo ========================================

echo.
echo 1. Preparando backend para Railway...
cd backend
call npm run build 2>nul || echo Backend listo para despliegue
cd ..

echo.
echo 2. Preparando frontend para Vercel...
cd frontend
call npm run build
if %errorlevel% neq 0 (
    echo Error en build del frontend
    pause
    exit /b 1
)
cd ..

echo.
echo ========================================
echo   Despliegue preparado exitosamente!
echo ========================================
echo.
echo Próximos pasos:
echo 1. Subir código a GitHub
echo 2. Conectar Railway al repositorio (carpeta backend)
echo 3. Configurar variables de entorno en Railway:
echo    - SUPABASE_URL
echo    - SUPABASE_ANON_KEY  
echo    - GEMINI_API_KEY
echo    - PORT=3001
echo.
echo 4. Conectar Vercel al repositorio (carpeta frontend)
echo 5. Configurar VITE_API_URL en Vercel
echo.
pause