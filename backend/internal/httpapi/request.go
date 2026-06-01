package httpapi

import (
	"encoding/json"
	"io"
	"net/http"
	"strings"
)

type parseError struct {
	code    string
	message string
}

func (e *parseError) Error() string {
	return e.message
}

func readRequestBody(r *http.Request) ([]byte, error) {
	if r.Body == nil {
		return nil, &parseError{code: "INVALID_INPUT", message: "Request body is required."}
	}
	defer r.Body.Close()

	body, err := io.ReadAll(io.LimitReader(r.Body, 1<<20))
	if err != nil {
		return nil, &parseError{code: "INVALID_INPUT", message: "Unable to read request body."}
	}
	if len(strings.TrimSpace(string(body))) == 0 {
		return nil, &parseError{code: "INVALID_INPUT", message: "Request body is required."}
	}
	return body, nil
}

func parseCalculateRequest(body []byte) (calculateRequest, error) {
	var req calculateRequest
	if err := json.Unmarshal(body, &req); err != nil {
		return calculateRequest{}, &parseError{code: "INVALID_INPUT", message: "Request body must be valid JSON."}
	}

	operation := strings.TrimSpace(req.Operation)
	if operation == "" {
		return calculateRequest{}, &parseError{code: "INVALID_INPUT", message: "Field 'operation' is required."}
	}
	req.Operation = operation

	if req.Operands == nil {
		return calculateRequest{}, &parseError{code: "INVALID_INPUT", message: "Field 'operands' is required."}
	}

	return req, nil
}
