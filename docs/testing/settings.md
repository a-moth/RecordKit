# Testing settings

`SettingsProvider` loads each default setting from its own `@`-prefixed AsyncStorage key and supplies defaults for missing values.

Test:

- the initial loading state;
- stored values overriding defaults;
- missing values receiving defaults;
- update persistence under the correct prefixed keys;
- batched updates;
- null normalization to an empty string;
- consumers outside the provider receiving the documented error;
- theme resolution from `**colourScheme`;
- setting-manager component selection through `settingDefinitions`.
- selection options for colour, time format, and date format;
- native and web image-setting data URIs, including the web-only display-name companion key;
- hidden default keys remaining unrendered when they have no `SETTING` entry.

Use fake setting values. Tests must not include genuine credentials, device paths, identifiers, or personal information.
