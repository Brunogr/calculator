set dotenv-load := true

BACKEND_PORT := env_var_or_default("BACKEND_PORT", "8080")
FRONTEND_PORT := env_var_or_default("FRONTEND_PORT", "5173")

default:
    @just --list

install:
    cd backend && go mod download
    cd frontend && npm install

debug:
    docker compose up --build

run:
    docker compose up --build

run-backend:
    cd backend && PORT={{BACKEND_PORT}} go run ./cmd/api

run-frontend:
    cd frontend && npm run dev -- --host 0.0.0.0 --port {{FRONTEND_PORT}}

test:
    cd backend && go test ./... -cover
    cd frontend && npm run test

test-backend:
    cd backend && go test ./... -cover

test-frontend:
    cd frontend && npm run test

build:
    cd backend && go build ./cmd/api
    cd frontend && npm run build

docker-build:
    docker compose build

docker-up:
    docker compose up --build

docker-down:
    docker compose down