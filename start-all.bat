@echo off
SETLOCAL EnableDelayedExpansion

cd /d "%~dp0client-react"
if not exist package.json (
    echo package.json not found in client-react
    goto end
)

start /B npm run start
cd /d "%~dp0"

for /d %%i in ("%~dp0microservices\*") do (
    if exist "%%i\package.json" (
        set "hasStart="
        for /f "delims=" %%x in ('findstr /c:"\"start\":" "%%i\package.json"') do set hasStart=true
        if defined hasStart (
            echo Starting microservice in %%i
            cd /d "%%i"
            start /B npm run start
        ) else (
            echo No start script found in package.json for %%~nxi
        )
        cd /d "%~dp0"
    ) else (
        echo package.json not found in %%i
    )
)

:end
echo All services attempted to start.
pause
ENDLOCAL
