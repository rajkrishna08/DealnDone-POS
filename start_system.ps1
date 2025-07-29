# DealNDone 2025 - System Startup Script
Write-Host "🚀 Starting DealNDone 2025 POS System..." -ForegroundColor Green

# Check if Python is installed
try {
    python --version | Out-Null
    Write-Host "✅ Python found" -ForegroundColor Green
} catch {
    Write-Host "❌ Python not found. Please install Python first." -ForegroundColor Red
    exit 1
}

# Check if Node.js is installed
try {
    node --version | Out-Null
    Write-Host "✅ Node.js found" -ForegroundColor Green
} catch {
    Write-Host "❌ Node.js not found. Please install Node.js first." -ForegroundColor Red
    exit 1
}

# Install backend dependencies
Write-Host "📦 Installing backend dependencies..." -ForegroundColor Yellow
Set-Location backend
pip install -r requirements.txt | Out-Null

# Install frontend dependencies
Write-Host "📦 Installing frontend dependencies..." -ForegroundColor Yellow
Set-Location ../frontend
npm install | Out-Null

# Start backend server
Write-Host "🔧 Starting backend server..." -ForegroundColor Yellow
Set-Location ../backend
Start-Process powershell -ArgumentList "-NoExit", "-Command", "python main.py"

# Wait a moment for backend to start
Start-Sleep -Seconds 3

# Start frontend server
Write-Host "🎨 Starting frontend server..." -ForegroundColor Yellow
Set-Location ../frontend
Start-Process powershell -ArgumentList "-NoExit", "-Command", "npm start"

# Wait a moment for frontend to start
Start-Sleep -Seconds 5

Write-Host "✅ DealNDone 2025 POS System is starting!" -ForegroundColor Green
Write-Host "🌐 Backend: http://localhost:8000" -ForegroundColor Cyan
Write-Host "🎨 Frontend: http://localhost:3000" -ForegroundColor Cyan
Write-Host "📖 API Docs: http://localhost:8000/docs" -ForegroundColor Cyan

Write-Host "`n🎉 Your POS system is ready! Open http://localhost:3000 in your browser." -ForegroundColor Green 