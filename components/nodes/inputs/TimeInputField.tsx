import { field_data, FieldNode, TimeData } from '../../../constants/DataTypes';
import { useTheme } from '../../../hooks/use-theme-provider';
import { useFocusBorderColor } from '../../../hooks/use-focus-border-color';
import { useSettings } from '../../../utils/SettingsProvider';
import { Text, TextInput, View } from 'react-native';
import { CommonProps } from '../../managers/SettingManager';

// TODO: fix time string handling at validation level not within this field

export default function TimeInputField({ template, id, onChange, field, fieldKey, defaultShown }: CommonProps) {
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
                value={value == null ? "" : value}
                onFocus={focusBorder.onFocus}
                onBlur={focusBorder.onBlur}
                onChangeText={(text) => {
                    updateSetting({
                        [fieldKey]: text == null ? "" : text === "" ? "" : text.includes(":") ? text : text + ":00"
                    })
                    if (template && field) {
                        const newField = field.field.clone();
                        newField.setData(text == null ? "" : text === "" ? "" : text.includes(":") ? text : text + ":00");

                        onChange?.(template, defaultShown, {
                            id,
                            type: "field",
                            field: newField,
                        });
                    }
                }}
                editable={fieldKey.startsWith("**") ? true : false}
            />
        </View>
    );
}