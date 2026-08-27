# Testing validation

`validateFieldData` and `hasValidationErrors` in `ValidationPreview.tsx` are the authoritative validation functions.

## Field cases

- Text and boolean fields accept their supported values.
- Number values must be finite.
- Duration values must be whole numbers greater than or equal to zero.
- Scale bounds must be non-negative integers with minimum below maximum; a non-zero value must fall within the range.
- Selection fields require options, enforce single selection when `multiple` is false, and reject selected identifiers no longer present in the options.
- Date and time values accept empty input, use a field-specific format before the setting default, and return an error for invalid tokens, values, or calendar dates without throwing.
- Image booleans require selected and unselected images after settings fallbacks are considered.
- Sections require at least one child.
- Unknown types return the incorrect-type error.

## Recursive and save behaviour

Test valid and invalid fields at the top level and at multiple section depths. Entry and template writer tests must show both that invalid data disables saving and that the save handler itself remains guarded.

Prefer asserting whether an error exists and its meaningful user-facing content. Exact full-string assertions are appropriate when the wording or referenced format is part of the interface.

