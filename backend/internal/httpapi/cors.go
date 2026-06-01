package httpapi

import (
	"net/http"
	"strings"

	rootbackend "github.com/Brunogr/calculator/backend"
	"github.com/Brunogr/calculator/backend/internal/config"
)

const swaggerHTML = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Calculator API</title>
  <link rel="stylesheet" href="https://unpkg.com/swagger-ui-dist@5/swagger-ui.css">
</head>
<body>
  <div id="swagger-ui"></div>
  <script src="https://unpkg.com/swagger-ui-dist@5/swagger-ui-bundle.js"></script>
  <script>
    window.ui = SwaggerUIBundle({
      url: '/openapi.yaml',
      dom_id: '#swagger-ui'
    });
  </script>
</body>
</html>`

// CORSMiddleware adds CORS headers for allowed origins.
func CORSMiddleware(cfg config.Config, next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		origin := r.Header.Get("Origin")
		if cfg.IsOriginAllowed(origin) {
			w.Header().Set("Access-Control-Allow-Origin", origin)
			w.Header().Set("Vary", "Origin")
			w.Header().Set("Access-Control-Allow-Methods", "POST, OPTIONS")
			w.Header().Set("Access-Control-Allow-Headers", "Content-Type")
		}

		next.ServeHTTP(w, r)
	})
}

// NewMux registers API and documentation routes.
func NewMux(cfg config.Config) *http.ServeMux {
	mux := http.NewServeMux()

	calculate := CORSMiddleware(cfg, &CalculateHandler{})
	mux.Handle(calculatePath, calculate)
	mux.Handle(calculatePath+"/", calculate)

	mux.HandleFunc("/openapi.yaml", serveOpenAPI)
	if cfg.SwaggerEnabled {
		mux.HandleFunc("/swagger/", serveSwaggerUI)
	}

	return mux
}

func serveOpenAPI(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		w.Header().Set("Allow", http.MethodGet)
		http.Error(w, "method not allowed", http.StatusMethodNotAllowed)
		return
	}
	w.Header().Set("Content-Type", "application/yaml; charset=utf-8")
	_, _ = w.Write(rootbackend.OpenAPISpec)
}

func serveSwaggerUI(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		w.Header().Set("Allow", http.MethodGet)
		http.Error(w, "method not allowed", http.StatusMethodNotAllowed)
		return
	}
	if !strings.HasSuffix(r.URL.Path, "/") && r.URL.Path != "/swagger" {
		http.Redirect(w, r, "/swagger/", http.StatusMovedPermanently)
		return
	}
	w.Header().Set("Content-Type", "text/html; charset=utf-8")
	_, _ = w.Write([]byte(swaggerHTML))
}
