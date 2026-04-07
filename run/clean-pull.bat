@echo off
REM ============================================
REM Clean Pull - Verwirft alle lokalen Aenderungen
REM und holt den aktuellen master von origin
REM ============================================

echo.
echo === Clean Pull Script ===
echo.

REM Zum Projekt-Root wechseln
cd /d "%~dp0.."

REM Git-Prozesse beenden die evtl. Dateien sperren
echo Beende evtl. laufende Git-Prozesse...
taskkill /f /im git.exe 2>nul

REM Index-Lock entfernen falls vorhanden
echo Entferne Index-Lock falls vorhanden...
del /f .git\index.lock 2>nul

REM Berechtigungen auf .git/logs reparieren
echo Repariere Berechtigungen...
attrib -r .git\logs\*.* /s 2>nul

REM Fetch und Hard Reset
echo.
echo Hole aktuellen Stand von origin...
git fetch origin

echo.
echo Reset auf origin/master...
git checkout master 2>nul
git reset --hard origin/master

REM Untracked Files entfernen (optional, auskommentiert)
REM git clean -fd

echo.
echo === Done! ===
echo.
git log --oneline -3
echo.
pause
