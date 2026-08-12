import { ScrollView } from "react-native";
import SettingsReader from "../../components/wrappers/SettingsReader";
import { useTheme } from "../../hooks/use-theme-provider";

export default function SettingsScreen() {
    const theme = useTheme();

    return (
        <ScrollView style={{ flex: 1, backgroundColor: theme.colors.background }}>
            <SettingsReader />
        </ScrollView>
    );
}