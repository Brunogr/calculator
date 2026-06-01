set dotenv-load := true
set windows-shell := ["powershell.exe", "-NoLogo", "-Command"]

BACKEND_PORT := env_var_or_default("BACKEND_PORT", "3000")
FRONTEND_PORT := env_var_or_default("FRONTEND_PORT", "5173")

default:
    @just --list

install:
    cd backend; go mod download
    cd frontend; npm install

install-backend:
    cd backend; go mod download

install-frontend:
    cd frontend; npm install

debug:
    docker compose up --build

run:
    docker compose up --build

run-backend:
    cd backend; go run ./cmd/api

run-frontend:
    cd frontend; npm run dev -- --host 0.0.0.0 --port {{FRONTEND_PORT}}

test:
    cd backend; go test ./... -cover
    cd frontend; npm run test:coverage

test-backend:
    cd backend; go test ./... -cover

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

docker-up:
    docker compose up --build

docker-down:
    docker compose down
