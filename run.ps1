# EmergencyConnect-AI Single-Command Startup Script

Write-Host "🚀 Checking backend dependencies in the current virtual environment..." -ForegroundColor Cyan

$hasDjango = python -c "import django" 2>$null
if ($LASTEXITCODE -ne 0) {
    Write-Host "📦 Dependencies missing. Installing backend dependencies from requirements.txt..." -ForegroundColor Yellow
    pip install -r backend/requirements.txt
} else {
    Write-Host "✅ Backend dependencies are already installed." -ForegroundColor Green
}

# 1. Start Django Backend in a separate window
Write-Host "🐍 Launching Django Backend in a new window..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd backend; ..\venv\Scripts\activate.ps1; python manage.py seed_tips; python manage.py runserver 8000"

# 2. Check if npm is in PATH, if not add standard installation path
if (-not (Get-Command npm -ErrorAction SilentlyContinue)) {
    Write-Host "📦 Adding Node.js to PATH..." -ForegroundColor DarkYellow
    $env:Path += ';C:\Program Files\nodejs'
}

# 3. Start Vite Frontend in this window
Write-Host "⚛️ Launching Vite Frontend on http://localhost:5173/ ..." -ForegroundColor Green
cd frontend
npm run dev
