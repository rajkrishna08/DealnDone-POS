# DealNDone POS - Simple Startup Script for Windows
Write-Host "🏪 DealNDone POS - Starting System..." -ForegroundColor Green

# Check if Python is installed
try {
    $pythonVersion = python --version 2>&1
    Write-Host "✅ Python found: $pythonVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Python not found. Please install Python first." -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}

# Install requirements
Write-Host "📦 Installing requirements..." -ForegroundColor Yellow
try {
    python -m pip install -r simple_requirements.txt
    Write-Host "✅ Requirements installed successfully!" -ForegroundColor Green
} catch {
    Write-Host "❌ Failed to install requirements" -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}

# Start the server
Write-Host ""
Write-Host "🚀 Starting DealNDone POS Server..." -ForegroundColor Green
Write-Host "📱 Frontend: Open frontend/index.html in your browser" -ForegroundColor Cyan
Write-Host "🔗 API: http://localhost:8000" -ForegroundColor Cyan
Write-Host "❤️  Health: http://localhost:8000/health" -ForegroundColor Cyan
Write-Host "📦 Products: http://localhost:8000/products" -ForegroundColor Cyan
Write-Host ""
Write-Host "Press Ctrl+C to stop the server" -ForegroundColor Yellow
Write-Host ""

try {
    python simple_main.py
} catch {
    Write-Host "❌ Error starting server" -ForegroundColor Red
} finally {
    Write-Host "👋 Server stopped!" -ForegroundColor Yellow
    Read-Host "Press Enter to exit"
}
