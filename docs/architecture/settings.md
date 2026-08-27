# Settings

`utils/SettingsProvider.tsx` provides application settings through React context. Each setting is persisted separately in AsyncStorage under an `@`-prefixed key and seeded from a hardcoded default map.

`constants/setting-enums.ts` maps setting keys to their supported input types: text, time, number, or locked.

`components/managers/SettingManager.tsx` selects the correct input through the `settingDefinitions` registry in `hooks/node-registry.tsx`. Settings-specific components manage their own input presentation while the provider owns persistence.

Date and time formatting uses `date-fns` tokens. Time-setting input is separate from entry-field time input so configuration parsing and record entry do not share incompatible interaction rules.

