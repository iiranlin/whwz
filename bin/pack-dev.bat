@echo off
echo.
echo [pack] Building DEV package (output to dist/) ...
echo.
cd /d %~dp0..
call pnpm pack:dev
pause
