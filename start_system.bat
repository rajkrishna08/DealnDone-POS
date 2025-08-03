@echo off
echo Starting Deal n Done POS System...
echo.

echo Starting Backend Server...
start "Backend Server" cmd /k "cd backend && python main.py"

echo.
echo Starting Frontend Server...
start "Frontend Server" cmd /k "cd frontend && npm start"

echo.
echo Both servers are starting...
echo Backend: http://localhost:8000
echo Frontend: http://localhost:3000
echo.
echo Press any key to exit...
pause 