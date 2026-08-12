import {
  Stack,
  ThemeProvider as NavigationThemeProvider,
  DefaultTheme as NavigationDefaultTheme,
  DarkTheme as NavigationDarkTheme,
} from "expo-router";
import { ThemeProvider, useTheme, DarkTheme as AppDarkTheme } from "../hooks/use-theme-provider";

import { SettingsProvider } from "../utils/SettingsProvider";

export default function App() {
  return (
    <SettingsProvider>
      <ThemeProvider>
        <RootLayout />
      </ThemeProvider>
    </SettingsProvider>
  );
}

function RootLayout() {
  const theme = useTheme();
  const isDark = theme === AppDarkTheme;

  // React Navigation renders its own full-screen background behind every
  // screen (the NavigationContainer's `colors.background`), independent of
  // any per-screen contentStyle. Without this, that layer stays on RN's
  // stock light-grey default no matter what our own theme sets.
  const navigationTheme = {
    ...(isDark ? NavigationDarkTheme : NavigationDefaultTheme),
    dark: isDark,
    colors: {
      ...(isDark ? NavigationDarkTheme.colors : NavigationDefaultTheme.colors),
      primary: theme.colors.primary,
      background: theme.colors.background,
      card: theme.colors.card,
      text: theme.colors.text,
      border: theme.colors.border,
      notification: theme.colors.notification,
    },
  };

  return (
    <NavigationThemeProvider value={navigationTheme}>
      <Stack
        screenOptions={{
          contentStyle: { backgroundColor: theme.colors.background },
          headerStyle: { backgroundColor: theme.colors.card },
          headerTintColor: theme.colors.text,
          headerTitleStyle: { color: theme.colors.text },
        }}
      />
    </NavigationThemeProvider>
  );
}
