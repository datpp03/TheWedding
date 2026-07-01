@echo off
setlocal

cd /d "%~dp0"
powershell.exe -NoProfile -ExecutionPolicy Bypass -File "%~dp0scripts\local-control.ps1"

if errorlevel 1 (
  echo.
  echo Local control panel exited with an error.
  pause
)
