import { field_data, FieldNode, NumberData } from '../../../constants/DataTypes';
import { useTheme } from '../../../hooks/use-theme-provider';
import { useFocusBorderColor } from '../../../hooks/use-focus-border-color';
import { useSettings } from '../../../utils/SettingsProvider';
import { Text, TextInput, View } from 'react-native';
import { CommonProps } from '../../managers/SettingManager';

export default function NumberInputField({ template, id, fieldKey, defaultShown, onChange, field, locked = false }: CommonProps) {
  const theme = useTheme();
  const { settings, updateSetting } = useSettings();
  const focusBorder = useFocusBorderColor(theme.colors.border, theme.colors.caution);
  if (!defaultShown) return null;

  const isEntry = !!(template && field);
  const settingValue = settings[fieldKey] ?? "";
  const value = isEntry ? (field!.field.data as NumberData).value : settingValue;

  return (
    <View style={theme.sizes.default.container}>
      <Text style={[theme.sizes.default.text, { color: theme.colors.text, fontFamily: theme.fonts?.regular.fontFamily }]}>{fieldKey}</Text>
      <TextInput
        style={[theme.sizes.default.input, { backgroundColor: theme.colors.background, borderColor: focusBorder.borderColor, color: theme.colors.text, fontFamily: theme.fonts?.regular.fontFamily }]}
        value={value == null || value === "0" ? "1" : String(value)}
        onFocus={focusBorder.onFocus}
        onBlur={focusBorder.onBlur}
        onChangeText={(text) => {
          if (isEntry) {
            const newField = field!.field.clone();
            newField.setData(text === "" ? 0 : Number(text));

            onChange?.(template!, defaultShown, {
              id: id,
              type: "field",
              field: newField,
            });
            return;
          }

          updateSetting({
            [fieldKey]: text == null ? "" : text === "" ? 0 : Number(text) <= 0 ? 0 : Number(text)
          })
        }}
        keyboardType="numeric"
        returnKeyType="done"
        editable={isEntry ? !locked : fieldKey.startsWith("**") ? true : false}
      />
    </View>
  );
}
