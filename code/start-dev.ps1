Write-Host "🚀 Starting Future-Ready Development Environment..." -ForegroundColor Green
Write-Host ""
Write-Host "This will start:" -ForegroundColor Yellow
Write-Host "  • Frontend (Vue.js) on http://localhost:5173" -ForegroundColor Cyan
Write-Host "  • Embedding API on http://localhost:3001" -ForegroundColor Cyan
Write-Host "  • Document Q&A API on http://localhost:3005" -ForegroundColor Cyan
Write-Host ""
Write-Host "Press Ctrl+C to stop all services" -ForegroundColor Red
Write-Host ""

try {
    npm run dev:full
} catch {
    Write-Host "❌ Error starting development environment: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "Make sure you're in the correct directory and all dependencies are installed." -ForegroundColor Yellow
    pause
}
