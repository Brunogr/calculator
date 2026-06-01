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

debug:
    docker compose up --build backend

run:
    docker compose up --build backend

run-backend:
    cd backend; go run ./cmd/api

run-frontend:
    cd frontend; npm run dev -- --host 0.0.0.0 --port {{FRONTEND_PORT}}

test:
    cd backend; go test ./... -cover
    cd frontend; npm run test

test-backend:
    cd backend; go test ./... -cover

test-frontend:
    cd frontend; npm run test

build:
    cd backend; go build ./cmd/api
    cd frontend; npm run build

build-backend:
    cd backend; go build ./cmd/api

docker-build:
    docker compose build backend

docker-build-backend:
    docker build -t calculator-backend ./backend

docker-up:
    docker compose up --build backend

docker-down:
    docker compose down
