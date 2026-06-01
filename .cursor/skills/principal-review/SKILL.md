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

   * Use idiomatic Go package names, file organization, and error handling.
   * Keep the implementation simple, explicit, and easy to review.
   * Prefer small functions with clear responsibilities.
   * Use table-driven tests for calculator and handler behavior.
   * Avoid Java/C#/TypeScript-style overengineering, unnecessary interfaces, and premature abstractions.
   * Follow KISS: choose the simplest solution that satisfies the requirement.
   * Prefer readability over cleverness.
   * Use meaningful names that describe intent and expected outcome.
   * Reuse code only when it improves clarity; avoid abstraction just to remove a few duplicated lines.
   * Apply clean code principles: clear boundaries, low cognitive load, predictable behavior, and easy-to-follow tests.
   * Apply SOLID principles pragmatically:

     * Single Responsibility: calculation logic, HTTP handling, and configuration should stay separate.
     * Open/Closed: adding a new operation should not require rewriting unrelated code.
     * Dependency Inversion: avoid unnecessary interfaces, but keep dependencies easy to replace or test when there is a real need.
   * Do not let SOLID principles create needless complexity in a small Go service.

5. React quality

   * Use a normal calculator layout with a clean display and button grid.
   * Use Material UI components to improve readability, accessibility, and visual consistency.
   * Keep component structure simple and easy to scan.
   * Prefer readable JSX using MUI layout primitives such as `Box`, `Stack`, `Grid`, `Paper`, `Button`, `Typography`, and `Alert`.
   * Keep state management local and understandable.
   * Use a reducer only if it makes calculator behavior clearer; avoid global state libraries.
   * Keep API access isolated from UI components.
   * Keep validation clear and close to the user interaction.
   * Ensure all buttons have accessible labels or clear text.
   * Show loading, result, and error states clearly.
   * Do not build a complex expression parser.
   * Avoid deeply nested JSX and duplicated button markup where a small configuration array would improve readability.
   * Apply clean code principles: clear component responsibilities, meaningful names, small helper functions, and easy-to-read tests.
   * Use Material UI to simplify markup, but do not over-customize the theme or create unnecessary design abstractions.
   * The frontend should feel polished, but still small and maintainable.

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