# Routing and application structure

RecordKit uses `expo-router` with file-based routes under `app/`.

`app/_layout.tsx` establishes the root provider and navigation hierarchy:

```text
SettingsProvider
└── ThemeProvider
    └── Stack
```

The tab routes live under `app/(tabs)/`:

- `index.tsx` is the entries home screen;
- `templates.tsx` is the template list;
- `settings.tsx` is the settings screen.

Template editing lives at `app/templates/edit.tsx`. The entry-writing route and template-editing route delegate their editing behaviour to `EntryWriter` and `TemplateWriter` respectively.

The existing type-oriented component layout is intentional for the current React Native application. Do not reorganise it into feature folders before the planned React + Vite PWA migration unless a specific approved plan authorises that change.

