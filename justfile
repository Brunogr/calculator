set dotenv-load := true
set windows-shell := ["powershell.exe", "-NoLogo", "-Command"]

BACKEND_PORT := env_var_or_default("BACKEND_PORT", "3000")
FRONTEND_PORT := env_var_or_default("FRONTEND_PORT", "5173")
VITE_API_BASE_URL := env_var_or_default("VITE_API_BASE_URL", "http://localhost:" + BACKEND_PORT)

# Export just variables (e.g. VITE_API_BASE_URL) to recipe subprocesses.
set export := true

default:
    @just --list

install:
    just install-backend
    just install-frontend

install-backend:
    cd backend; go mod download

install-frontend:
    cd frontend; npm install

debug:
    node scripts/dev.mjs

run:
    just dev

dev:
    docker compose up --build

run-backend:
    cd backend; go run ./cmd/api

run-frontend:
    cd frontend; npm run dev -- --host 0.0.0.0 --port {{FRONTEND_PORT}}

test:
    just test-backend
    just test-frontend

test-backend:
    cd backend; go test ./... '-coverprofile=coverage.out'; New-Item -ItemType Directory -Force coverage | Out-Null; go tool cover -html coverage.out -o coverage/index.html

test-frontend:
    cd frontend; npm run test:coverage

build:
    cd backend; go build ./cmd/api
    cd frontend; npm run build

build-backend:
    cd backend; go build ./cmd/api

build-frontend:
    cd frontend; npm run build

docker-build:
    docker compose build

docker-build-backend:
    docker build -t calculator-backend ./backend

docker-build-frontend:
    docker build -t calculator-frontend --build-arg VITE_API_BASE_URL=${VITE_API_BASE_URL:-http://localhost:3000} ./frontend

docker-down:
    docker compose down
