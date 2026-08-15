import { field_data, FieldNode, SettingsData } from '../../../constants/DataTypes';
import { useTheme } from '../../../hooks/use-theme-provider';
import { useFocusBorderColor } from '../../../hooks/use-focus-border-color';
import { useSettings } from '../../../utils/SettingsProvider';
import { Text, TextInput, View } from 'react-native';
import { CommonProps } from '../../managers/SettingManager';

export default function SettingInputField({ template, id, field, onChange, fieldKey, defaultShown }: CommonProps) {
  const theme = useTheme();
  const { settings, updateSetting } = useSettings();
  const focusBorder = useFocusBorderColor(theme.colors.border, theme.colors.caution);
  if (!defaultShown) return null;

  const value = settings[fieldKey] ?? "";
  return (
    <View style={theme.sizes.default.container}>
      <Text style={[theme.sizes.default.text, { color: theme.colors.text, fontFamily: theme.fonts?.regular.fontFamily }]}>{fieldKey}</Text>
      <TextInput
        style={[theme.sizes.default.input, { backgroundColor: theme.colors.background, borderColor: focusBorder.borderColor, color: theme.colors.text, fontFamily: theme.fonts?.regular.fontFamily }]}
        value={value}
        onFocus={focusBorder.onFocus}
        onBlur={focusBorder.onBlur}
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
