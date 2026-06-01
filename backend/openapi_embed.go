package backend

import _ "embed"

// OpenAPISpec is the embedded OpenAPI contract served at GET /openapi.yaml.
//
//go:embed api/openapi.yaml
var OpenAPISpec []byte
