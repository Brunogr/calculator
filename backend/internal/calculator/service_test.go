package calculator

import (
	"errors"
	"math"
	"testing"
)

func TestCalculate(t *testing.T) {
	t.Parallel()

	tests := []struct {
		name      string
		operation string
		operands  []float64
		want      float64
		wantCode  ErrorCode
	}{
		// add
		{name: "add integers", operation: "add", operands: []float64{10, 5}, want: 15},
		{name: "add decimals", operation: "add", operands: []float64{1.5, 2.25}, want: 3.75},
		{name: "add negatives", operation: "add", operands: []float64{-3, -7}, want: -10},
		{name: "add zero", operation: "add", operands: []float64{0, 42}, want: 42},

		// subtract
		{name: "subtract", operation: "subtract", operands: []float64{10, 4}, want: 6},
		{name: "subtract negative result", operation: "subtract", operands: []float64{3, 8}, want: -5},

		// multiply
		{name: "multiply", operation: "multiply", operands: []float64{6, 7}, want: 42},
		{name: "multiply by zero", operation: "multiply", operands: []float64{99, 0}, want: 0},
		{name: "multiply decimals", operation: "multiply", operands: []float64{2.5, 4}, want: 10},

		// divide
		{name: "divide", operation: "divide", operands: []float64{10, 4}, want: 2.5},
		{name: "divide negative", operation: "divide", operands: []float64{-8, 2}, want: -4},
		{name: "division by zero", operation: "divide", operands: []float64{10, 0}, wantCode: CodeDivisionByZero},

		// power
		{name: "power", operation: "power", operands: []float64{2, 10}, want: 1024},
		{name: "power zero exponent", operation: "power", operands: []float64{99, 0}, want: 1},
		{name: "power fractional", operation: "power", operands: []float64{9, 0.5}, want: 3},
		{name: "power negative base", operation: "power", operands: []float64{-2, 3}, want: -8},

		// sqrt
		{name: "sqrt", operation: "sqrt", operands: []float64{16}, want: 4},
		{name: "sqrt zero", operation: "sqrt", operands: []float64{0}, want: 0},
		{name: "sqrt decimal", operation: "sqrt", operands: []float64{2}, want: math.Sqrt(2)},
		{name: "negative sqrt", operation: "sqrt", operands: []float64{-1}, wantCode: CodeNegativeSqrt},

		// percentage
		{name: "percentage", operation: "percentage", operands: []float64{200, 15}, want: 30},
		{name: "percentage decimal percent", operation: "percentage", operands: []float64{50, 12.5}, want: 6.25},
		{name: "percentage zero percent", operation: "percentage", operands: []float64{100, 0}, want: 0},

		// operand count errors
		{name: "add too few operands", operation: "add", operands: []float64{1}, wantCode: CodeInvalidOperandCount},
		{name: "add too many operands", operation: "add", operands: []float64{1, 2, 3}, wantCode: CodeInvalidOperandCount},
		{name: "add no operands", operation: "add", operands: []float64{}, wantCode: CodeInvalidOperandCount},
		{name: "sqrt too many operands", operation: "sqrt", operands: []float64{4, 9}, wantCode: CodeInvalidOperandCount},
		{name: "sqrt no operands", operation: "sqrt", operands: nil, wantCode: CodeInvalidOperandCount},

		// unsupported
		{name: "unsupported operation", operation: "modulo", operands: []float64{10, 3}, wantCode: CodeUnsupportedOperation},
		{name: "empty operation", operation: "", operands: []float64{1, 2}, wantCode: CodeUnsupportedOperation},

		// non-finite operands
		{name: "add with NaN", operation: "add", operands: []float64{math.NaN(), 1}, wantCode: CodeInvalidOperand},
		{name: "add with positive infinity", operation: "add", operands: []float64{math.Inf(1), 1}, wantCode: CodeInvalidOperand},
		{name: "sqrt with NaN", operation: "sqrt", operands: []float64{math.NaN()}, wantCode: CodeInvalidOperand},

		// large values
		{name: "large multiply", operation: "multiply", operands: []float64{1e10, 1e10}, want: 1e20},
	}

	for _, tt := range tests {
		tt := tt
		t.Run(tt.name, func(t *testing.T) {
			t.Parallel()
			got, err := Calculate(tt.operation, tt.operands)
			if tt.wantCode != "" {
				if err == nil {
					t.Fatal("expected error, got nil")
				}
				var domainErr *DomainError
				if !errors.As(err, &domainErr) {
					t.Fatalf("expected DomainError, got %T: %v", err, err)
				}
				if domainErr.Code != tt.wantCode {
					t.Fatalf("code = %q, want %q", domainErr.Code, tt.wantCode)
				}
				return
			}
			if err != nil {
				t.Fatalf("unexpected error: %v", err)
			}
			if got != tt.want {
				t.Fatalf("result = %v, want %v", got, tt.want)
			}
		})
	}
}

func TestIsSupportedOperation(t *testing.T) {
	t.Parallel()

	tests := []struct {
		operation string
		want      bool
	}{
		{"add", true},
		{"sqrt", true},
		{"percentage", true},
		{"modulo", false},
		{"", false},
	}

	for _, tt := range tests {
		t.Run(tt.operation, func(t *testing.T) {
			t.Parallel()
			if got := IsSupportedOperation(tt.operation); got != tt.want {
				t.Fatalf("IsSupportedOperation(%q) = %v, want %v", tt.operation, got, tt.want)
			}
		})
	}
}

func TestRequiredOperandCount(t *testing.T) {
	t.Parallel()

	if got := RequiredOperandCount("sqrt"); got != 1 {
		t.Fatalf("sqrt count = %d, want 1", got)
	}
	if got := RequiredOperandCount("divide"); got != 2 {
		t.Fatalf("divide count = %d, want 2", got)
	}
	if got := RequiredOperandCount("unknown"); got != -1 {
		t.Fatalf("unknown count = %d, want -1", got)
	}
}
