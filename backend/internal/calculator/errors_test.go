package calculator

import "testing"

func TestDomainErrorMessage(t *testing.T) {
	err := newDomainError(CodeDivisionByZero, "Cannot divide by zero.")
	if err.Error() != "Cannot divide by zero." {
		t.Fatalf("Error() = %q", err.Error())
	}
}
