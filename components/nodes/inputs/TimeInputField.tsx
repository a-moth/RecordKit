import { field_data, FieldNode, TimeData } from '../../../constants/DataTypes';
import { useTheme } from '../../../hooks/use-theme-provider';
import { useSettings } from '../../../utils/SettingsProvider';
import { Text, TextInput, View } from 'react-native';
import { CommonProps } from '../../managers/SettingManager';

// TODO: fix time string handling at validation level not within this field

export default function TimeInputField({ template, id, onChange, field, fieldKey, defaultShown }: CommonProps) {
    const theme = useTheme();
    const { settings, updateSetting } = useSettings();
    if (!defaultShown) return null;

    const value = settings[fieldKey] ?? "";

    const fieldData = field.field.data as TimeData;

    return (
        <View style={theme.sizes.default.container}>
            <Text style={[theme.sizes.default.text, { color: theme.colors.text, fontFamily: theme.fonts?.regular.fontFamily }]}>{fieldKey}</Text>
            <TextInput
                style={[theme.sizes.default.input, { backgroundColor: theme.colors.card, borderColor: theme.colors.border, color: theme.colors.text, fontFamily: theme.fonts?.regular.fontFamily }]}
                value={value == null ? "" : value}
                onChangeText={(text) => {
                    updateSetting({
                        [fieldKey]: text == null ? "6:00" : text === "" ? "" : text.includes(":") ? text : text + ":00"
                    })
                    if (template && field) {
                        onChange?.(
                            template,
                            defaultShown,
                            {
                                id,
                                type: "field",
                                field: {
                                    ...field.field,
                                    data: {
                                        ...fieldData,
                                        value: text == null ? "6:00" : text === "" ? "" : text.includes(":") ? text : text + ":00"
                                    } as TimeData,
                                } as field_data<TimeData>,
                            } as FieldNode<TimeData>
                        );

                    }
                }}
                editable={fieldKey.startsWith("**") ? true : false}
            />
        </View>
    );
}