# Testing storage

Through 1.1, `utils/StorageUtil.ts` stores one `appData` value containing serialized template and entry maps.

Storage tests should reset the AsyncStorage mock between cases and cover:

- absent storage returning the default template and no entries;
- valid stored data reconstructing class instances;
- missing template or entry collections falling back safely;
- an empty template map restoring the default template;
- save serialization keyed by template identifier and entry name;
- individual getters for present, absent, and empty identifiers;
- entry deletion and persistence;
- template editing and deletion;
- protection of the bundled default template from editing and deletion;
- malformed JSON and malformed serialized containers according to the actual error contract.

Version 1.2 migration tests will add shipped-data migration, partial-failure, retry, and recovery cases. Do not write tests now that assume the future per-record shape already exists.

