# Migrations

RecordKit has no shipped-data migration implemented yet because 1.0 is the first preserved storage baseline.

Version 1.2 will introduce the first storage-shape migration. Its design must document:

- source and destination formats;
- detection and idempotency;
- ordering and transaction boundaries;
- partial failure and retry behaviour;
- backup or recovery behaviour;
- validation before old data is discarded;
- the reserved `@images/` namespace;
- compatibility with later image storage.

Migration implementation and tests must use synthetic fixtures rather than personal user records.

