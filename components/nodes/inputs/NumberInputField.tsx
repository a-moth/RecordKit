import { field_data, FieldNode, NumberData } from '../../../constants/DataTypes';
import { useTheme } from '../../../hooks/use-theme-provider';
import { useSettings } from '../../../utils/SettingsProvider';
import { Text, TextInput, View } from 'react-native';
import { CommonProps } from '../../managers/SettingManager';

//TODO: fix to be both for settings and general
export default function NumberInputField({ template, id, fieldKey, defaultShown, onChange, field }: CommonProps) {
  const theme = useTheme();
  const { settings, updateSetting } = useSettings();
  if (!defaultShown) return null;

  const value = settings[fieldKey] ?? "";

  const fieldData = field.field.data as NumberData;

  return (
    <View style={theme.sizes.default.container}>
      <Text style={[theme.sizes.default.text, { color: theme.colors.text, fontFamily: theme.fonts?.regular.fontFamily }]}>{fieldKey}</Text>
      <TextInput
        style={[theme.sizes.default.input, { backgroundColor: theme.colors.card, borderColor: theme.colors.border, color: theme.colors.text, fontFamily: theme.fonts?.regular.fontFamily }]}
        value={value == null || value === "0" ? "1" : String(value)}
        onChangeText={(text) => {
          updateSetting({
            [fieldKey]: text == null ? "" : text === "" ? "" : Number(text) <= 0 ? 1 : Number(text)
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
                    ...fieldData,
                    value: Number(text),
                  } as NumberData,
                } as field_data<NumberData>,
              } as FieldNode<NumberData>
            );
          }
        }}
        keyboardType="numeric"
        returnKeyType="done"
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
