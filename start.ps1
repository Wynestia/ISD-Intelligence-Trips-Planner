# start.ps1 - Run API and Frontend simultaneously
# Usage: .\start.ps1

$projectRoot = $PSScriptRoot

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Wynestia Trip Planner - Starting Up  " -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan

# Start FastAPI in a new terminal window
Write-Host "`n[1/2] Starting FastAPI (LLM API) on http://localhost:8000 ..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList @(
    "-NoExit",
    "-Command",
    "cd '$projectRoot'; Write-Host '=== LLM API ===' -ForegroundColor Green; .venv\Scripts\Activate.ps1; cd llm\src\service; python api.py"
)

# Small delay so the API window opens first
Start-Sleep -Seconds 1

# Start Vite frontend in a new terminal window
Write-Host "[2/2] Starting Frontend (Vite) on http://localhost:3000 ..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList @(
    "-NoExit",
    "-Command",
    "cd '$projectRoot\isd-frontend'; Write-Host '=== Frontend ===' -ForegroundColor Magenta; npm run dev"
)

Write-Host "`n✅ Both services are starting in separate windows." -ForegroundColor Green
Write-Host "   API  → http://localhost:8000" -ForegroundColor Cyan
Write-Host "   Docs → http://localhost:8000/docs" -ForegroundColor Cyan
Write-Host "   Web  → http://localhost:3000" -ForegroundColor Cyan
