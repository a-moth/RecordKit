# Records and entries

The active code calls an individual completed record an **entry**. An entry is represented by `EntryContainer` with metadata type `entry`.

Entry metadata includes:

- `templateId`: the template against which the entry was created;
- `name`: the current key used in the entries map;
- `lastModified`: modification timestamp;
- `createdAt`: creation timestamp;
- `order`: top-level node order.

The current storage API provides `getEntry`, `getEntries`, and `deleteEntry`. Entry creation and editing are persisted by saving the containing `appData` envelope rather than through independent per-entry keys.

