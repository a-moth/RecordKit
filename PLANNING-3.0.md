# RecordKit 3.0 — Local API

## Status

Future major version.

## Objective

Provide a local-host-only API through which users can programmatically access and manage their own RecordKit data.

## Principles

- The API remains local to the user's device and does not create a hosted RecordKit service.
- Authentication, binding, permissions, and cross-origin behaviour must default to protecting sensitive data.
- API representations align with documented portable data formats and migrations.
- Users receive explicit control over whether the API runs and what it exposes.
- Versioning and deprecation rules are documented before public use.

Endpoint design and implementation technology remain deliberately unspecified until this version is actively planned.

