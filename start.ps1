# start.ps1 - Run Database, API, Backend, and Frontend simultaneously
# Usage: .\start.ps1

$projectRoot = $PSScriptRoot

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Wynestia Trip Planner - Starting Up  " -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan

# [1/4] Starting Database via Docker
Write-Host "`n[1/4] Starting Database (PostgreSQL) via Docker..." -ForegroundColor Yellow
cd "$projectRoot\isd-backend"
docker compose up -d
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Failed to start Docker. Please make sure Docker Desktop is running." -ForegroundColor Red
    exit
}

# [2/4] Initialize Database Schema (Prisma)
Write-Host "[2/4] Syncing Database Schema (Prisma)..." -ForegroundColor Yellow
npx prisma db push
if ($LASTEXITCODE -ne 0) {
    Write-Host "⚠️ Warning: Prisma sync failed. Backend might have issues." -ForegroundColor DarkYellow
}

# [3/4] Start FastAPI in a new terminal window
Write-Host "[3/4] Starting FastAPI (LLM API) on http://localhost:8000 ..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList @(
    "-NoExit",
    "-Command",
    "cd '$projectRoot'; Write-Host '=== LLM API ===' -ForegroundColor Green; .venv\Scripts\Activate.ps1; cd llm\src\service; python api.py"
)

# Small delay
Start-Sleep -Seconds 1

# [4/4] Start Elysia Backend and Frontend in new terminal windows
Write-Host "[4/4] Starting Backend (Elysia) and Frontend (Vite)..." -ForegroundColor Yellow

# Backend
Start-Process powershell -ArgumentList @(
    "-NoExit",
    "-Command",
    "cd '$projectRoot\isd-backend'; Write-Host '=== Backend ===' -ForegroundColor Cyan; npx tsx ./main.ts"
)

# Frontend
Start-Process powershell -ArgumentList @(
    "-NoExit",
    "-Command",
    "cd '$projectRoot\isd-frontend'; Write-Host '=== Frontend ===' -ForegroundColor Magenta; npm run dev"
)

# Prisma Studio
Start-Process powershell -ArgumentList @(
    "-NoExit",
    "-Command",
    "cd '$projectRoot\isd-backend'; Write-Host '=== Prisma Studio ===' -ForegroundColor Yellow; npx prisma studio"
)

Write-Host "`n✅ All services are starting in separate windows." -ForegroundColor Green
Write-Host "   API      → http://localhost:8000" -ForegroundColor Cyan
Write-Host "   Backend  → http://localhost:3123" -ForegroundColor Cyan
Write-Host "   Frontend → http://localhost:3000" -ForegroundColor Cyan
Write-Host "   Studio   → http://localhost:5555" -ForegroundColor Yellow
Write-Host "   Database → localhost:5433" -ForegroundColor Cyan
