# RecordKit 1.1 — White-box test coverage

## Status

Current development target.

## Objective

Establish comprehensive white-box test coverage for the existing 1.0 product before further feature development changes its foundations.

## Scope

- Test the class-based data model and its tree operations.
- Test every registered field type and its meaningful behaviours.
- Test recursive field validation, including invalid and partial date/time values.
- Test entry and template save guards.
- Test current storage and settings behaviour.
- Test component and writer behaviour where logic cannot be covered meaningfully below the component boundary.
- Document manual checks that cannot be represented reliably in automated tests.

## Rules

- This version primarily attests to existing behaviour; do not redesign features merely to make tests easier.
- Every new implementation change from this version onward includes appropriate white-box tests in the same work.
- Bugs discovered by testing may be fixed within 1.1 when the test demonstrates an existing behaviour failure.
- Storage-shape migration remains 1.2 scope.
- User-uploaded image persistence remains 1.3 scope.

## Completion criteria

- Existing product behaviours have proportionate white-box coverage.
- Tests cover success, failure, boundary, and recursive cases where applicable.
- The full automated suite passes.
- Remaining manual-only checks are documented under `docs/testing/`.

