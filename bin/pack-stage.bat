@echo off
echo.
echo [pack] Building STAGE package (output to dist/) ...
echo.
cd /d %~dp0..
call pnpm pack:stage
pause
