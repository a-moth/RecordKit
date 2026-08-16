import { Pressable, Text, TextInput, View } from 'react-native';
import { useTheme } from '../../../hooks/use-theme-provider';
import { useSettings } from '../../../utils/SettingsProvider';
import { useImagePicker } from '../../../hooks/use-image-picker';
import { CommonProps } from '../../managers/SettingManager';
import { field_data, FieldNode, SettingsData } from '../../../constants/DataTypes';

// The data URI alone can't recover the original filename, so it's kept in a
// companion settings key purely for display in the locked path field.
const nameSettingKey = (fieldKey: string) => `${fieldKey}::name`;

// TODO: no limit on file size, but load async if too large to load into memory
export default function FileInputField({ template, id, field, onChange, fieldKey, defaultShown, locked = false }: CommonProps) {
    const theme = useTheme();
    const { settings, updateSetting } = useSettings();
    const { pickImage } = useImagePicker();
    if (!defaultShown) return null;

    const value = settings[fieldKey] ?? "";
    const displayValue = settings[nameSettingKey(fieldKey)] ?? (value ? "Stored file" : "");

    async function handlePick() {
        if (locked) return;

        const picked = await pickImage();
        if (!picked) return;

        updateSetting({
            [fieldKey]: picked.uri,
            [nameSettingKey(fieldKey)]: picked.name ?? "Stored file",
        });

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
                            value: picked.uri,
                        } as SettingsData,
                    } as field_data<SettingsData>,
                } as FieldNode<SettingsData>
            );
        }
    }

    return (
        <View style={theme.sizes.default.container}>
            <Text style={[theme.sizes.default.text, { color: theme.colors.text, fontFamily: theme.fonts?.regular.fontFamily }]}>{fieldKey}</Text>
            <View style={[theme.sizes.default.row, { alignItems: 'center' }]}>
                <TextInput
                    value={displayValue}
                    editable={false}
                    placeholder="No file selected"
                    placeholderTextColor={theme.colors.subtext}
                    style={[
                        theme.sizes.default.input,
                        {
                            flex: 1,
                            backgroundColor: theme.colors.background,
                            borderColor: theme.colors.border,
                            color: theme.colors.subtext,
                            fontFamily: theme.fonts?.regular.fontFamily,
                        },
                    ]}
                />
                <Pressable
                    onPress={handlePick}
                    disabled={locked}
                    style={{
                        ...theme.sizes.default.button,
                        ...theme.sizes.default.regularButton,
                        ...theme.sizes.default.alignCenter,
                        marginLeft: 8,
                        backgroundColor: theme.colors.accent,
                        borderColor: theme.colors.border,
                        opacity: locked ? 0.5 : 1,
                    }}
                >
                    <Text style={[theme.sizes.default.buttonText, { color: theme.colors.background }]}>
                        {value ? "Change File" : "Choose File"}
                    </Text>
                </Pressable>
            </View>
        </View>
    );
}
