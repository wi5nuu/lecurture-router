@echo off
chcp 65001 >nul
title LectureRouter - Push to GitHub
echo.
echo [92m============================================[0m
echo [92m   LectureRouter - Push ke GitHub [0m
echo [92m============================================[0m
echo.
echo Repository: https://github.com/wi5nuu/lecurture-router.git
echo.

:: Cek apakah git sudah diinisialisasi
if not exist .git (
    echo [93mMenginisialisasi git repository...[0m
    git init
    git add -A
    git commit -m "Initial commit: LectureRouter"
) else (
    echo [93mGit repository sudah ada, menambahkan perubahan...[0m
    git add -A
    git commit -m "Update LectureRouter"
)

echo.
echo [93mMenambahkan remote origin...[0m
git remote remove origin 2>nul
git remote add origin https://github.com/wi5nuu/lecurture-router.git

echo.
echo [93mPush ke GitHub (master branch)...[0m
echo [93mMasukkan username dan token/password GitHub jika diminta.[0m
echo.
git push -u origin master

echo.
if %errorlevel% equ 0 (
    echo [92m============================================[0m
    echo [92m   Push berhasil! ^:^) [0m
    echo [92m============================================[0m
    echo.
    echo Buka: https://github.com/wi5nuu/lecurture-router
) else (
    echo [91mPush gagal. Coba manual:[0m
    echo   1. git remote add origin https://github.com/wi5nuu/lecurture-router.git
    echo   2. git push -u origin master
)

echo.
pause
