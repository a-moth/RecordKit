# Settings

`utils/SettingsProvider.tsx` provides application settings through React context. Each setting is persisted separately in AsyncStorage under an `@`-prefixed key and seeded from a hardcoded default map.

`constants/setting-enums.ts` maps exposed setting keys to text, time, number, selection, image, or locked inputs. `SETTING_OPTIONS` supplies the allowed colour-scheme, time-format, and date-format values.

`components/managers/SettingManager.tsx` selects the correct input through the `settingDefinitions` registry in `hooks/node-registry.tsx`. Settings-specific components manage their own input presentation while the provider owns persistence.

Date and time formatting uses `date-fns` tokens. Time-setting input is separate from entry-field time input so configuration parsing and record entry do not share incompatible interaction rules.

Image settings store selected files as data URIs. On web, a companion `::name` key preserves the display filename because it cannot be recovered from the data URI. Durable size-sensitive storage remains 1.3 scope.

The provider's default map still contains hidden legacy purchase/unlock keys that are not present in `SETTING` and therefore are not rendered by `SettingManager`. They do not represent an active payment or monetisation system.
