@echo off
title Bahasa Humanis-Digital Server
echo =================================================================
echo   Memulai Platform Pembelajaran Bahasa Humanis-Digital...
echo   Membuka localhost:8080 di web browser
echo =================================================================
start http://localhost:8080
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0server.ps1" -Port 8080
pause

