package calculator

import (
	"math"
)

// Unary operations require exactly one operand.
var unaryOperations = map[string]struct{}{
	"sqrt": {},
}

// Binary operations require exactly two operands.
var binaryOperations = map[string]struct{}{
	"add":        {},
	"subtract":   {},
	"multiply":   {},
	"divide":     {},
	"power":      {},
	"percentage": {},
}

// Calculate performs the requested operation on the given operands.
func Calculate(operation string, operands []float64) (float64, error) {
	if err := validateOperands(operation, operands); err != nil {
		return 0, err
	}

	switch operation {
	case "add":
		return operands[0] + operands[1], nil
	case "subtract":
		return operands[0] - operands[1], nil
	case "multiply":
		return operands[0] * operands[1], nil
	case "divide":
		if operands[1] == 0 {
			return 0, newDomainError(CodeDivisionByZero, "Cannot divide by zero.")
		}
		return operands[0] / operands[1], nil
	case "power":
		return math.Pow(operands[0], operands[1]), nil
	case "sqrt":
		if operands[0] < 0 {
			return 0, newDomainError(CodeNegativeSqrt, "Cannot take the square root of a negative number.")
		}
		return math.Sqrt(operands[0]), nil
	case "percentage":
		return operands[0] * operands[1] / 100, nil
	default:
		return 0, newDomainError(CodeUnsupportedOperation, "Unsupported operation.")
	}
}

func validateOperands(operation string, operands []float64) error {
	if _, ok := unaryOperations[operation]; ok {
		if len(operands) != 1 {
			return newDomainError(CodeInvalidOperandCount, "This operation requires exactly one operand.")
		}
		return validateFinite(operands[0])
	}

	if _, ok := binaryOperations[operation]; ok {
		if len(operands) != 2 {
			return newDomainError(CodeInvalidOperandCount, "This operation requires exactly two operands.")
		}
		if err := validateFinite(operands[0]); err != nil {
			return err
		}
		return validateFinite(operands[1])
	}

	return newDomainError(CodeUnsupportedOperation, "Unsupported operation.")
}

func validateFinite(value float64) error {
	if math.IsNaN(value) || math.IsInf(value, 0) {
		return newDomainError(CodeInvalidOperand, "Operands must be finite numbers.")
	}
	return nil
}

// RequiredOperandCount returns the expected operand count for a supported operation, or -1 if unsupported.
func RequiredOperandCount(operation string) int {
	if _, ok := unaryOperations[operation]; ok {
		return 1
	}
	if _, ok := binaryOperations[operation]; ok {
		return 2
	}
	return -1
}

// IsSupportedOperation reports whether the operation is known to the calculator.
func IsSupportedOperation(operation string) bool {
	return RequiredOperandCount(operation) > 0
}
