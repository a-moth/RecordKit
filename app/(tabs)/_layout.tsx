import { useTheme } from "../../hooks/use-theme-provider";
import { Stack, Tabs } from "expo-router"
import { useSettings } from "../../utils/SettingsProvider";

export default function Layout() {
    const { settings } = useSettings();
    const theme = useTheme();

    return (
        <>
            <Stack.Screen
                options={{
                    title: settings?.["**appNickname"] || "Journal",
                }}
            />
            <Tabs
                screenOptions={{
                    headerShown: false,
                    tabBarStyle: {
                        backgroundColor: theme.colors.card, // replace with your theme value
                        borderTopColor: theme.colors.border,
                    },
                    tabBarActiveTintColor: theme.colors.text,
                    tabBarInactiveTintColor: theme.colors.text,
                }}
            >
                <Tabs.Screen name="index" />
                <Tabs.Screen name="templates" />
                <Tabs.Screen name="settings" />
            </Tabs>
        </>
    );
}