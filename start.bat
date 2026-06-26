@echo off
echo ========================================
echo   Starting AlumniConnect
echo ========================================
echo.

echo [1/2] Starting Backend Server...
start "AlumniConnect Backend" cmd /k "npm run dev:backend"

timeout /t 2 /nobreak > nul

echo [2/2] Starting Frontend Server...
start "AlumniConnect Frontend" cmd /k "npm run dev"

echo.
echo Both servers are starting!
echo - Backend will be on http://localhost:5000
echo - Frontend will be on http://localhost:3000
echo.
echo Press any key to close this window (servers will keep running)
pause > nul
