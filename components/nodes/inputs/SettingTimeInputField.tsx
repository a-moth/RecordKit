import { useTheme } from '../../../hooks/use-theme-provider';
import { useFocusBorderColor } from '../../../hooks/use-focus-border-color';
import { useSettings } from '../../../utils/SettingsProvider';
import { Text, TextInput, View } from 'react-native';
import { CommonProps } from '../../managers/SettingManager';

export default function SettingTimeInputField({ fieldKey, defaultShown, locked = false }: CommonProps) {
    const theme = useTheme();
    const { settings, updateSetting } = useSettings();

    const focusBorder = useFocusBorderColor(theme.colors.border, theme.colors.caution);

    /**
       * date-fns tokens:
       *
       * dd
       * MM
       * MMM
       * yyyy
       * yy
       */

    const timeFormat = settings["**timeFormat"] ?? "HH:mm";

    if (!defaultShown) {
        return null;
    }

    const settingValue = settings[fieldKey] ?? "";

    return (
        <View style={theme.sizes.default.container}>
            <Text style={[theme.sizes.default.text, { color: theme.colors.text, fontFamily: theme.fonts?.regular.fontFamily }]}>{fieldKey}</Text>
            <TextInput
                style={[theme.sizes.default.input, { backgroundColor: theme.colors.background, borderColor: focusBorder.borderColor, color: theme.colors.text, fontFamily: theme.fonts?.regular.fontFamily }]}
                value={settingValue}
                placeholder={timeFormat}
                placeholderTextColor={
                    theme.colors.subtext
                }
                onFocus={focusBorder.onFocus}
                onBlur={focusBorder.onBlur}
                onChangeText={(text) => {
                    updateSetting({
                        [fieldKey]: text
                    })
                }}
                editable={!locked && fieldKey.startsWith("**")}
            />
        </View>
    );
}