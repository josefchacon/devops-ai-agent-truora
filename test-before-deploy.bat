@echo off
echo ========================================
echo   Testing Before Deploy - Checklist
echo ========================================

echo.
echo 1. TESTING FRONTEND LOCALMENTE...
echo.
cd frontend
echo Iniciando servidor de desarrollo...
echo.
echo ⚠️  INSTRUCCIONES:
echo.
echo 1. Se abrirá http://localhost:5173
echo 2. Probar TODAS las funcionalidades:
echo    ✅ Login (admin / truora2024)
echo    ✅ Dashboard carga correctamente
echo    ✅ Upload Logs funciona
echo    ✅ Logout funciona
echo    ✅ Navegación entre páginas
echo.
echo 3. Si TODO funciona correctamente:
echo    - Cerrar este terminal (Ctrl+C)
echo    - Ejecutar: git add . && git commit -m "mensaje" && git push
echo.
echo 4. Si hay ERRORES:
echo    - Cerrar terminal (Ctrl+C)
echo    - Arreglar errores
echo    - Volver a ejecutar este script
echo.
echo ========================================
echo   Presiona ENTER para iniciar testing
echo ========================================
pause

npm run dev