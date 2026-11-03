@echo off
chcp 65001 > nul
title DAY KET QUA LEN GITHUB - PORTFOLIO NHOM UTH
cd /d "%~dp0"

echo =====================================================================
echo       CONG CU TU DONG DAY CODE LEN GITHUB - PORTFOLIO NHOM (UTH)
echo =====================================================================
echo.

set "GIT_EXE=C:\Users\tan\AppData\Local\Programs\Git\cmd\git.exe"
where git >nul 2>nul
if %errorlevel% equ 0 (
    set "GIT_CMD=git"
) else if exist "%GIT_EXE%" (
    set "GIT_CMD=%GIT_EXE%"
) else (
    echo [LOI] Khong tim thay Git tren may tinh!
    echo Vui long cai dat Git hoac kiem tra lai.
    pause
    exit /b 1
)

echo [1/5] Dang kiem tra kho luu tru Git...
if not exist ".git" (
    echo Khoi tao Git repository moi...
    "%GIT_CMD%" init
)

echo.
echo [2/5] Kiem tra cau hinh nguoi dung Git...
for /f "delims=" %%i in ('"%GIT_CMD%" config user.name') do set GIT_USER=%%i
if "%GIT_USER%"=="" (
    set /p NEW_NAME="Nhap ten cua ban (vi du: Nguyen Duy Tan): "
    "%GIT_CMD%" config user.name "%NEW_NAME%"
)
for /f "delims=" %%i in ('"%GIT_CMD%" config user.email') do set GIT_EMAIL=%%i
if "%GIT_EMAIL%"=="" (
    set /p NEW_EMAIL="Nhap email cua ban (vi du: tan@example.com): "
    "%GIT_CMD%" config user.email "%NEW_EMAIL%"
)

echo.
echo [3/5] Dang them cac file vao Git (bo qua node_modules theo .gitignore)...
"%GIT_CMD%" add .

echo.
echo [4/5] Dang tao commit...
"%GIT_CMD%" commit -m "feat: complete UTH team portfolio hub for 6 members"
"%GIT_CMD%" branch -M main

echo.
echo [5/5] Ket noi va day len GitHub...
"%GIT_CMD%" remote get-url origin >nul 2>nul
if %errorlevel% neq 0 (
    echo.
    echo Hay tao mot repository moi tren GitHub (https://github.com/new).
    echo Sau do copy link repository vao day (vi du: https://github.com/username/portfolio-nhom.git):
    set /p REPO_URL="Dan link repository GitHub vao day: "
    if not "%REPO_URL%"=="" (
        "%GIT_CMD%" remote add origin %REPO_URL%
    )
)

echo.
echo Dang day code len GitHub (nhanh main)...
"%GIT_CMD%" push -u origin main

if %errorlevel% equ 0 (
    echo.
    echo =====================================================================
    echo [THANH CONG] Da day toan bo du an len GitHub thanh cong!
    echo Ban co the vao Settings -> Pages de bat che do website truc tuyen!
    echo =====================================================================
) else (
    echo.
    echo [CHU Y] Neu gap loi dang nhap GitHub, vui long dang nhap tren trinh duyet
    echo hoac dung Personal Access Token (PAT) de xac thuc.
)

echo.
pause
