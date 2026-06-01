package httpapi

import (
	"encoding/json"
	"errors"
	"io"
	"net/http"
	"strings"

	"github.com/Brunogr/calculator/backend/internal/calculator"
)

const calculatePath = "/api/v1/calculate"

type calculateRequest struct {
	Operation string    `json:"operation"`
	Operands  []float64 `json:"operands"`
}

type successResponse struct {
	Result float64 `json:"result"`
}

type errorBody struct {
	Code    string `json:"code"`
	Message string `json:"message"`
}

type errorResponse struct {
	Error errorBody `json:"error"`
}

// CalculateHandler handles POST /api/v1/calculate.
type CalculateHandler struct{}

func (h *CalculateHandler) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	if r.Method == http.MethodOptions {
		w.WriteHeader(http.StatusNoContent)
		return
	}
	if r.Method != http.MethodPost {
		writeError(w, http.StatusMethodNotAllowed, "METHOD_NOT_ALLOWED", "Only POST is allowed for this endpoint.")
		return
	}

	if r.Body == nil {
		writeError(w, http.StatusBadRequest, "INVALID_INPUT", "Request body is required.")
		return
	}
	defer r.Body.Close()

	body, err := io.ReadAll(io.LimitReader(r.Body, 1<<20))
	if err != nil {
		writeError(w, http.StatusBadRequest, "INVALID_INPUT", "Unable to read request body.")
		return
	}
	if len(strings.TrimSpace(string(body))) == 0 {
		writeError(w, http.StatusBadRequest, "INVALID_INPUT", "Request body is required.")
		return
	}

	var req calculateRequest
	if err := json.Unmarshal(body, &req); err != nil {
		writeError(w, http.StatusBadRequest, "INVALID_INPUT", "Request body must be valid JSON.")
		return
	}

	operation := strings.TrimSpace(req.Operation)
	if operation == "" {
		writeError(w, http.StatusBadRequest, "INVALID_INPUT", "Field 'operation' is required.")
		return
	}

	if req.Operands == nil {
		writeError(w, http.StatusBadRequest, "INVALID_INPUT", "Field 'operands' is required.")
		return
	}

	if !calculator.IsSupportedOperation(operation) {
		writeError(w, http.StatusBadRequest, "UNSUPPORTED_OPERATION", "Unsupported operation.")
		return
	}

	result, err := calculator.Calculate(operation, req.Operands)
	if err != nil {
		var domainErr *calculator.DomainError
		if errors.As(err, &domainErr) {
			writeError(w, http.StatusBadRequest, string(domainErr.Code), domainErr.Message)
			return
		}
		writeError(w, http.StatusInternalServerError, "INTERNAL_ERROR", "An unexpected error occurred.")
		return
	}

	writeJSON(w, http.StatusOK, successResponse{Result: result})
}

func writeJSON(w http.ResponseWriter, status int, payload any) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(status)
	_ = json.NewEncoder(w).Encode(payload)
}

func writeError(w http.ResponseWriter, status int, code, message string) {
	writeJSON(w, status, errorResponse{
		Error: errorBody{
			Code:    code,
			Message: message,
		},
	})
}
