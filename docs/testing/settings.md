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

Use fake setting values. Tests must not include genuine credentials, device paths, identifiers, or personal information.

