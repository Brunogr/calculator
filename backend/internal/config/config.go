package config

import (
	"os"
	"strconv"
	"strings"
)

// Config holds application configuration loaded from environment variables.
type Config struct {
	Port              string
	CORSAllowedOrigins []string
	SwaggerEnabled    bool
	AppEnv            string
}

// Load reads configuration from environment variables with sensible defaults.
func Load() Config {
	return Config{
		Port:              envOrDefault("PORT", envOrDefault("BACKEND_PORT", "3000")),
		CORSAllowedOrigins: parseOrigins(envOrDefault("CORS_ALLOWED_ORIGINS", "http://localhost:5173")),
		SwaggerEnabled:    parseBool(envOrDefault("SWAGGER_ENABLED", "true"), true),
		AppEnv:            envOrDefault("APP_ENV", "development"),
	}
}

func envOrDefault(key, fallback string) string {
	if value := strings.TrimSpace(os.Getenv(key)); value != "" {
		return value
	}
	return fallback
}

func parseOrigins(value string) []string {
	parts := strings.Split(value, ",")
	origins := make([]string, 0, len(parts))
	for _, part := range parts {
		origin := strings.TrimSpace(part)
		if origin != "" {
			origins = append(origins, origin)
		}
	}
	return origins
}

func parseBool(value string, fallback bool) bool {
	parsed, err := strconv.ParseBool(strings.TrimSpace(value))
	if err != nil {
		return fallback
	}
	return parsed
}

// IsOriginAllowed reports whether the given Origin header value is permitted.
func (c Config) IsOriginAllowed(origin string) bool {
	if origin == "" {
		return false
	}
	for _, allowed := range c.CORSAllowedOrigins {
		if origin == allowed {
			return true
		}
	}
	return false
}
