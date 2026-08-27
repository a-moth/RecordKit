# Compatibility

## Current policy

Pre-1.0 development data was disposable. Data shipped from 1.0 onward must be preserved or explicitly migrated when a storage or serialization change is released.

Current deserialization requires container metadata and fields, complete nodes, and field data containing a type, label, and visibility value. Malformed JSON and several incomplete shapes return `null`. An unrecognised container metadata type throws. An unrecognised field type is not rejected consistently and can leave an unreconstructed raw node in the returned container; callers must not treat the current factory as a complete schema validator. Syntactically invalid outer `appData` JSON follows the storage helper's runtime error behaviour.

## Documentation requirement

When a representation is deprecated, document:

- what is deprecated and since which version;
- its replacement;
- whether existing stored data still works;
- the migration path and whether it is automatic or manual;
- the planned removal version, if known.
