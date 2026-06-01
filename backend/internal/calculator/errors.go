package calculator

// ErrorCode identifies stable API error codes for domain failures.
type ErrorCode string

const (
	CodeUnsupportedOperation ErrorCode = "UNSUPPORTED_OPERATION"
	CodeInvalidOperandCount  ErrorCode = "INVALID_OPERAND_COUNT"
	CodeDivisionByZero       ErrorCode = "DIVISION_BY_ZERO"
	CodeNegativeSqrt         ErrorCode = "NEGATIVE_SQRT"
	CodeInvalidOperand       ErrorCode = "INVALID_OPERAND"
)

// DomainError is a calculator domain failure with a stable code and message.
type DomainError struct {
	Code    ErrorCode
	Message string
}

func (e *DomainError) Error() string {
	return e.Message
}

func newDomainError(code ErrorCode, message string) *DomainError {
	return &DomainError{Code: code, Message: message}
}
