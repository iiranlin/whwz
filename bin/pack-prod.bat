@echo off
echo.
echo [pack] Building PROD package (output to dist/) ...
echo.
cd /d %~dp0..
call pnpm pack:prod
pause
