package config

import (
	"testing"
)

func TestLoadDefaults(t *testing.T) {
	t.Setenv("PORT", "")
	t.Setenv("CORS_ALLOWED_ORIGINS", "")
	t.Setenv("SWAGGER_ENABLED", "")
	t.Setenv("APP_ENV", "")

	cfg := Load()

	if cfg.Port != "3000" {
		t.Fatalf("Port = %q, want 3000", cfg.Port)
	}
	if len(cfg.CORSAllowedOrigins) != 1 || cfg.CORSAllowedOrigins[0] != "http://localhost:5173" {
		t.Fatalf("CORSAllowedOrigins = %#v", cfg.CORSAllowedOrigins)
	}
	if !cfg.SwaggerEnabled {
		t.Fatal("expected SwaggerEnabled true")
	}
	if cfg.AppEnv != "development" {
		t.Fatalf("AppEnv = %q, want development", cfg.AppEnv)
	}
}

func TestLoadBackendPortFallback(t *testing.T) {
	t.Setenv("PORT", "")
	t.Setenv("BACKEND_PORT", "9090")
	t.Setenv("CORS_ALLOWED_ORIGINS", "")
	t.Setenv("SWAGGER_ENABLED", "")
	t.Setenv("APP_ENV", "")

	cfg := Load()
	if cfg.Port != "9090" {
		t.Fatalf("Port = %q, want 9090 from BACKEND_PORT fallback", cfg.Port)
	}
}

func TestLoadOverrides(t *testing.T) {
	t.Setenv("PORT", "9090")
	t.Setenv("CORS_ALLOWED_ORIGINS", "http://a.test, http://b.test ")
	t.Setenv("SWAGGER_ENABLED", "false")
	t.Setenv("APP_ENV", "production")

	cfg := Load()

	if cfg.Port != "9090" {
		t.Fatalf("Port = %q, want 9090", cfg.Port)
	}
	if len(cfg.CORSAllowedOrigins) != 2 {
		t.Fatalf("CORSAllowedOrigins = %#v", cfg.CORSAllowedOrigins)
	}
	if cfg.CORSAllowedOrigins[0] != "http://a.test" || cfg.CORSAllowedOrigins[1] != "http://b.test" {
		t.Fatalf("unexpected origins: %#v", cfg.CORSAllowedOrigins)
	}
	if cfg.SwaggerEnabled {
		t.Fatal("expected SwaggerEnabled false")
	}
	if cfg.AppEnv != "production" {
		t.Fatalf("AppEnv = %q, want production", cfg.AppEnv)
	}
}

func TestParseBoolInvalidFallsBack(t *testing.T) {
	t.Setenv("SWAGGER_ENABLED", "not-a-bool")

	cfg := Load()
	if !cfg.SwaggerEnabled {
		t.Fatal("expected invalid bool to fall back to true")
	}
}

func TestIsOriginAllowed(t *testing.T) {
	cfg := Config{CORSAllowedOrigins: []string{"http://localhost:5173", "http://example.com"}}

	if !cfg.IsOriginAllowed("http://localhost:5173") {
		t.Fatal("expected localhost origin to be allowed")
	}
	if cfg.IsOriginAllowed("http://evil.com") {
		t.Fatal("expected unknown origin to be denied")
	}
	if cfg.IsOriginAllowed("") {
		t.Fatal("expected empty origin to be denied")
	}
}
