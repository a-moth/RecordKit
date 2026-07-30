import { field_data, FieldNode, SettingsData } from '../../../constants/DataTypes';
import { useTheme } from '../../../hooks/use-theme-provider';
import { useSettings } from '../../../utils/SettingsProvider';
import { Text, TextInput, View } from 'react-native';
import { CommonProps } from '../../managers/SettingManager';

export default function SettingInputField({ template, id, field, onChange, fieldKey, defaultShown }: CommonProps) {
  const theme = useTheme();
  const { settings, updateSetting } = useSettings();
  if (!defaultShown) return null;

  const value = settings[fieldKey] ?? "";

  return (
    <View style={theme.sizes.default.container}>
      <Text style={[theme.sizes.default.text, { color: theme.colors.text, fontFamily: theme.fonts?.regular.fontFamily }]}>{fieldKey}</Text>
      <TextInput
        style={[theme.sizes.default.input, { backgroundColor: theme.colors.card, borderColor: theme.colors.border, color: theme.colors.text, fontFamily: theme.fonts?.regular.fontFamily }]}
        value={value}
        onChangeText={(text) => {
          updateSetting({
            [fieldKey]: text
          })
          if (template && field) {
            onChange?.(
              template,
              defaultShown,
              {
                id: id,
                type: "field",
                field: {
                  ...field.field,
                  data: {
                    ...field.field.data,
                    value: text
                  } as SettingsData,
                } as field_data<SettingsData>,
              } as FieldNode<SettingsData>
            );
          }
        }}
        editable={fieldKey.startsWith("**") ? true : false}
      />
    </View>
  );
}

// TODO: the text is a "string" instead of a string
// settingsFolder must be set with a default by-operating-system
// UUID *must* be randomised on initialisation of app for each user - give warning to not share UUID
// dayFormat default can be grabbed from OS and if not, this default
// timeFormat same as day
// colourScheme only light and dark (both grayscale) for default, default matches OS setting by default
// if a colour scheme is purchased, add its theme to colourScheme options in settings
