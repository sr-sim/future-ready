@echo off
echo Starting Future-Ready Development Environment...
echo.
echo This will start:
echo - Frontend (Vue.js) on http://localhost:5173
echo - Embedding API on http://localhost:3001
echo - Document Q&A API on http://localhost:3005
echo.
echo Press Ctrl+C to stop all services
echo.

npm run dev:full
