@echo off
chcp 65001 > nul
title PORTFOLIO HUB NHOM - UTH
cd /d "%~dp0"
echo ========================================================
echo   KHOI DONG TRANG TONG HOP PORTFOLIO NHOM (UTH)
echo ========================================================
echo.
echo Dang khoi dong server tai http://localhost:5500 ...
start http://localhost:5500

where node >nul 2>nul
if %errorlevel% equ 0 (
    echo Dang su dung Node.js de chay server...
    node server.js
    pause
    exit /b
)

where python >nul 2>nul
if %errorlevel% equ 0 (
    echo Dang su dung Python de chay server...
    python -m http.server 5500
    pause
    exit /b
)

echo Khong tim thay Node.js hoac Python.
echo Ban co the mo file index.html truc tiep hoac dung Live Server trong VS Code!
pause
