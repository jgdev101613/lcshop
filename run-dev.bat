@echo off
concurrently -n backend,frontend -c green,blue "cd backend && npm run dev" "cd frontend && npm run dev -- --host"
pause