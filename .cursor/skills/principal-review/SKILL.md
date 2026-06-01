---
name: principal-review
description: Review the full repository as a Principal Software Engineer take-home assignment evaluator.
---

# Principal Review

Use this skill before final submission.

Review the repository as if evaluating a Principal Software Engineer take-home assignment.

## Review dimensions

Check:

1. Assignment completeness
   - React frontend exists
   - Go backend exists
   - API works
   - normal calculator UI exists
   - OpenAPI spec exists
   - Swagger UI is available
   - Docker setup exists
   - justfile exists
   - environment examples exist
   - tests exist for both layers
   - README exists
   - AI usage is documented

2. Correctness
   - operations are implemented correctly
   - division by zero is handled
   - invalid input is handled
   - square root negative input is handled
   - percentage behavior is documented
   - API and OpenAPI spec match
   - frontend operation mapping matches backend operation names

3. Architecture
   - backend separates HTTP from calculation logic
   - backend has simple configuration handling
   - frontend separates API client from UI
   - frontend uses configurable API base URL
   - no unnecessary infrastructure
   - no unnecessary abstractions
   - Docker setup is practical and not overcomplicated

4. Go quality
   - idiomatic package names
   - explicit error handling
   - table-driven tests
   - no Java/C#/TypeScript-style overengineering

5. React quality
   - normal calculator layout
   - readable state management
   - clear validation
   - accessible labels or aria-labels for buttons
   - loading/result/error states
   - no complex expression parser

6. Documentation
   - setup instructions
   - environment variable documentation
   - justfile commands
   - Docker instructions
   - backend run instructions
   - frontend run instructions
   - test instructions
   - API examples
   - Swagger/OpenAPI details
   - design decisions
   - assumptions
   - AI usage summary

7. Risk
   - anything that could look sloppy
   - anything that could look overengineered
   - anything that could confuse the evaluator
   - anything undocumented in README

## Output format

Return:

~~~md
## Summary

One paragraph.

## Must fix before submission

Concrete issues only.

## Nice to improve

Small improvements if time remains.

## Overengineering check

Anything that should be removed or simplified.

## Missing tests

Specific missing tests.

## Documentation gaps

README or AI usage items that need updating.

## Final recommendation

Ready to submit or not ready.
~~~

Do not suggest new features outside the assignment scope.