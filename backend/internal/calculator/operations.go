package calculator

import "math"

type binaryEvaluator func(a, b float64) (float64, error)
type unaryEvaluator func(a float64) (float64, error)

var binaryEvaluators = map[string]binaryEvaluator{
	"add":        func(a, b float64) (float64, error) { return a + b, nil },
	"subtract":   func(a, b float64) (float64, error) { return a - b, nil },
	"multiply":   func(a, b float64) (float64, error) { return a * b, nil },
	"power":      func(a, b float64) (float64, error) { return math.Pow(a, b), nil },
	"percentage": func(a, b float64) (float64, error) { return a * b / 100, nil },
	"divide": func(a, b float64) (float64, error) {
		if b == 0 {
			return 0, newDomainError(CodeDivisionByZero, "Cannot divide by zero.")
		}
		return a / b, nil
	},
}

var unaryEvaluators = map[string]unaryEvaluator{
	"sqrt": func(a float64) (float64, error) {
		if a < 0 {
			return 0, newDomainError(CodeNegativeSqrt, "Cannot take the square root of a negative number.")
		}
		return math.Sqrt(a), nil
	},
}

func evaluate(operation string, operands []float64) (float64, error) {
	if eval, ok := unaryEvaluators[operation]; ok {
		return eval(operands[0])
	}
	if eval, ok := binaryEvaluators[operation]; ok {
		return eval(operands[0], operands[1])
	}
	return 0, newDomainError(CodeUnsupportedOperation, "Unsupported operation.")
}
