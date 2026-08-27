# Routing and application structure

RecordKit uses `expo-router` with file-based routes under `app/`.

`app/_layout.tsx` establishes the root provider and navigation hierarchy:

```text
SettingsProvider
└── ThemeProvider
    └── RootLayout
        └── NavigationThemeProvider
            └── Stack
```

The tab routes live under `app/(tabs)/`:

- `index.tsx` is the entries home screen;
- `templates.tsx` is the template list;
- `settings.tsx` is the settings screen.

The tab layout sets the parent stack title from `**appNickname` and applies the application theme to the tab bar. `RootLayout` translates the RecordKit theme into a React Navigation theme so the navigation container and headers share the same colours as screen content.

Template editing lives at `app/templates/edit.tsx`. The entry-writing route and template-editing route delegate their editing behaviour to `EntryWriter` and `TemplateWriter` respectively.

The existing type-oriented component layout is intentional for the current React Native application. Do not reorganise it into feature folders before the planned PWA migration unless a specific approved plan authorises that change.
