# Storage

RecordKit currently stores application data through `@react-native-async-storage/async-storage`, wrapped by `utils/StorageUtil.ts`.

Through version 1.1, templates and entries intentionally remain inside one `appData` value shaped as:

```text
{
  templates: { ... },
  entries: { ... }
}
```

Version 1.2 owns the storage-shape migration. It will move to per-entry and per-template keys or adopt an explicitly evaluated embedded database. The migrated design must reserve `@images/` as a logical namespace and store each durable image separately rather than embedding image payloads in entry or template records.

Pre-1.0 development data was disposable. Data shipped from 1.0 onward must be preserved or migrated when storage formats change.

Because records may contain sensitive health and personal information:

- do not transmit stored values by default;
- treat export and migration changes as high-risk;
- keep all integrations explicit and user-configured;
- do not add a RecordKit server or implicit sync mechanism.

