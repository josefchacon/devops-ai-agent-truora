@echo off
echo Liberando puerto 3001...

for /f "tokens=5" %%a in ('netstat -ano ^| findstr :3001') do (
    echo Terminando proceso %%a
    taskkill /PID %%a /F 2>nul
)

echo Puerto 3001 liberado
pause