# RecordKit 1.3 — User-uploaded images

## Status

Planned after the 1.2 storage migration.

## Objective

Allow users to select and durably store their own images for supported fields without placing large payloads inside records.

## Scope

- Complete the image-handling work identified in the picker components and `StorageUtil.ts`.
- Harden the existing uploaded-image support for settings, image-boolean fields, and scale-field icons.
- Continue using `@react-native-documents/picker` for selection.
- Keep images under approximately 5 MB inline as data URIs.
- Copy larger images into durable application storage and store their paths.
- Load path-backed images asynchronously.
- Surface selection, copy, load, and missing-file failures clearly to the user.
- Add white-box tests for size thresholds, representations, failures, and cleanup behaviour.

## Dependencies and constraints

- Depends on the 1.2 storage shape and its `@images/` namespace.
- Native and web selection, including image-boolean and scale overrides, currently produces data URIs; this version adds the durable size-sensitive policy.
- Sensitive images must not be transmitted or logged.
