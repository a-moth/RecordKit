import { Pressable, Text } from "react-native";
import { useTheme } from "../../hooks/use-theme-provider";

type MiniButtonColor = "neutral" | "primary" | "danger" | "caution";

export default function MiniButton({ label, onPress, disabled, color = "neutral" }: {
    label: string;
    onPress: () => void;
    disabled?: boolean;
    color?: MiniButtonColor;
}) {
    const theme = useTheme();

    const accent = {
        neutral: theme.colors.border,
        primary: theme.colors.primary,
        danger: theme.colors.danger,
        caution: theme.colors.caution,
    }[color];

    return (
        <Pressable
            onPress={onPress}
            disabled={disabled}
            style={[
                theme.sizes.default.microButton,
                {
                    borderColor: accent,
                    backgroundColor: theme.colors.card,
                    opacity: disabled ? 0.5 : 1,
                },
            ]}
        >
            <Text
                style={[
                    theme.sizes.default.microButtonText,
                    { color: accent, fontFamily: theme.fonts?.regular.fontFamily },
                ]}
            >
                {label}
            </Text>
        </Pressable>
    );
}
