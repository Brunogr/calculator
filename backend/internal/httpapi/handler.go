package httpapi

import (
	"encoding/json"
	"errors"
	"net/http"

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

	body, err := readRequestBody(r)
	if err != nil {
		writeParseError(w, err)
		return
	}

	req, err := parseCalculateRequest(body)
	if err != nil {
		writeParseError(w, err)
		return
	}

	if !calculator.IsSupportedOperation(req.Operation) {
		writeError(w, http.StatusBadRequest, "UNSUPPORTED_OPERATION", "Unsupported operation.")
		return
	}

	result, err := calculator.Calculate(req.Operation, req.Operands)
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

func writeParseError(w http.ResponseWriter, err error) {
	var perr *parseError
	if errors.As(err, &perr) {
		writeError(w, http.StatusBadRequest, perr.code, perr.message)
		return
	}
	writeError(w, http.StatusBadRequest, "INVALID_INPUT", "Invalid request.")
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
