package main

import (
	"log"
	"net/http"

	"github.com/Brunogr/calculator/backend/internal/config"
	"github.com/Brunogr/calculator/backend/internal/httpapi"
)

func main() {
	cfg := config.Load()
	mux := httpapi.NewMux(cfg)

	addr := ":" + cfg.Port
	log.Printf("starting calculator API on %s (env=%s, swagger=%t)", addr, cfg.AppEnv, cfg.SwaggerEnabled)
	if err := http.ListenAndServe(addr, mux); err != nil {
		log.Fatalf("server failed: %v", err)
	}
}
