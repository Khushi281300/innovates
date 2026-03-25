@echo off
title MCD AI COPILOT - RESTART & REPAIR
echo ==========================================
echo   MCD AI COPILOT HARD RESTART
echo ==========================================

:: 1. Force kill any hanging processes
echo [1/3] Killing hanging processes (FastAPI, Node, Curl)...
taskkill /F /IM python.exe /T 2>nul
taskkill /F /IM node.exe /T 2>nul
taskkill /F /IM curl.exe /T 2>nul

:: 2. Launch Backend in new window
echo [2/3] Launching AI Backend (Mock-Mode Enabled)...
cd mcd-backend
start "MCD Backend AI Engine" cmd /k ".\venv\Scripts\activate && python -m uvicorn main:app --host 0.0.0.0 --port 8000"

:: 3. Launch Frontend
echo [3/3] Launching Dashboard...
cd ..\mcd-frontend
start "MCD Frontend Dashboard" cmd /k "npm run dev"

echo ==========================================
echo [SUCCESS] DLL-Bypass Mocking is now active!
echo 📝 Dashboard: http://localhost:3000
echo ==========================================
echo Keep both terminal windows open.
pause
