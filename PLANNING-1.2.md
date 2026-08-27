# RecordKit 1.2 — Storage-shape migration

## Status

Planned after 1.1.

## Objective

Replace the single `appData` storage blob with a shape that supports independent records and future durable image storage.

## Required investigation

Evaluate whether RecordKit should use per-entry and per-template AsyncStorage keys or a suitable embedded database. Record the accepted choice and rejected alternatives in `docs/architecture/decisions/` before implementation makes the decision irreversible.

## Required invariants

- Preserve data shipped from 1.0 onward through an explicit migration.
- Reserve `@images/` as the logical namespace for independently stored images.
- Do not embed durable image payloads directly in entry or template records.
- Preserve local-first operation and avoid implicit network activity.
- Make partial migration and recovery behaviour explicit.

## Scope

- Define and document the new storage shape.
- Implement migration from the shipped `appData` shape.
- Update storage helpers and their callers.
- Add compatibility and migration reference documentation.
- Add white-box coverage for migration, CRUD, failure, and recovery paths.

## Out of scope

- User-uploaded image policy and interface, which belong to 1.3.
- Automatic device sync or server-side storage.
- Analytics.

