import { Pressable, Text } from "react-native";
import { useTheme } from "../../hooks/use-theme-provider";

export default function ThemedButton({ title, onPress, disabled, variant = "primary" }: {
    title: string;
    onPress: () => void;
    disabled?: boolean;
    variant?: "primary" | "danger";
}) {
    const theme = useTheme();

    const backgroundColor = variant === "danger" ? theme.colors.danger : theme.colors.primary;

    return (
        <Pressable
            onPress={onPress}
            disabled={disabled}
            style={[
                theme.sizes.default.button,
                theme.sizes.default.alignCenter,
                {
                    backgroundColor,
                    opacity: disabled ? 0.6 : 1,
                },
            ]}
        >
            <Text
                style={[
                    theme.sizes.default.buttonText,
                    { color: theme.colors.background, fontFamily: theme.fonts?.bold.fontFamily },
                ]}
            >
                {title}
            </Text>
        </Pressable>
    );
}
