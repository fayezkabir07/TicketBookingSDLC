@echo off
title Movie Ticket Booking App

echo Starting backend server...
cd /d "%~dp0backend"
start "Backend Server" cmd /k "npm run dev"

echo Starting frontend dev server...
cd /d "%~dp0frontend"
start "Frontend Dev Server" cmd /k "npm run dev"

echo.
echo Both servers are starting up.
echo Backend:  http://localhost:5000
echo Frontend: http://localhost:6500
echo.
pause
