# PowerShell script to start the server persistently
Write-Host "=== STARTING DEAL N DONE SERVER ===" -ForegroundColor Green
Write-Host "Time: $(Get-Date)" -ForegroundColor Yellow
Write-Host "Directory: $(Get-Location)" -ForegroundColor Yellow

# Kill any existing Python processes
Write-Host "Killing existing Python processes..." -ForegroundColor Red
taskkill /f /im python.exe 2>$null

# Wait 2 seconds
Start-Sleep -Seconds 2

# Start the server
Write-Host "Starting server..." -ForegroundColor Green
python main.py 