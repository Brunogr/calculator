# syntax=docker/dockerfile:1

FROM golang:1.22-alpine AS builder

WORKDIR /src
COPY go.mod ./
RUN go mod download
COPY . .
RUN CGO_ENABLED=0 go build -o /bin/api ./cmd/api

FROM alpine:3.20

RUN adduser -D -g '' appuser
USER appuser

WORKDIR /home/appuser
COPY --from=builder /bin/api /api

ENV PORT=3000
EXPOSE 3000

ENTRYPOINT ["/api"]
