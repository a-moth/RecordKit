import React, { createContext, useContext } from "react";

import * as catppuccin from "@catppuccin/palette";

import { Sizes } from "../constants/theme";
import { useSettings } from "../utils/SettingsProvider";

// transfer the static fields to @theme.ts
const palettes = {
  light: catppuccin.flavors.latte,
  dark: catppuccin.flavors.macchiato,
};

export const DarkTheme = {
  dark: palettes.dark,
  colors: {
    primary: palettes.dark.colors.teal.hex,
    accent: palettes.dark.colors.green.hex,
    background: palettes.dark.colors.base.hex,
    card: palettes.dark.colors.surface0.hex,
    surfaceAlt: palettes.dark.colors.surface1.hex,
    text: palettes.dark.colors.text.hex,
    subtext: palettes.dark.colors.subtext0.hex,
    border: palettes.dark.colors.surface2.hex,
    danger: palettes.dark.colors.red.hex,
    success: palettes.dark.colors.green.hex,
    warning: palettes.dark.colors.yellow.hex,
    caution: palettes.dark.colors.peach.hex,
    notification: palettes.dark.colors.rosewater.hex,
  },
  sizes: Sizes,
  fonts: {
    regular: { fontFamily: "Inter-Regular", fontWeight: "normal" },
    medium: { fontFamily: "Inter-Medium", fontWeight: "normal" },
    bold: { fontFamily: "Inter-Bold", fontWeight: "bold" },
    heavy: { fontFamily: "Inter-Black", fontWeight: "bold" },
  },
};

export const LightTheme = {
  dark: palettes.light,
  colors: {
    primary: palettes.light.colors.lavender.hex,
    accent: palettes.light.colors.blue.hex,
    background: palettes.light.colors.base.hex,
    card: palettes.light.colors.surface0.hex,
    surfaceAlt: palettes.light.colors.surface1.hex,
    text: palettes.light.colors.text.hex,
    subtext: palettes.light.colors.subtext0.hex,
    border: palettes.light.colors.surface2.hex,
    danger: palettes.light.colors.red.hex,
    success: palettes.light.colors.green.hex,
    warning: palettes.light.colors.yellow.hex,
    caution: palettes.light.colors.peach.hex,
    notification: palettes.light.colors.rosewater.hex,
  },
  sizes: Sizes,
  fonts: {
    regular: { fontFamily: "Inter-Regular", fontWeight: "normal" },
    medium: { fontFamily: "Inter-Medium", fontWeight: "normal" },
    bold: { fontFamily: "Inter-Bold", fontWeight: "bold" },
    heavy: { fontFamily: "Inter-Black", fontWeight: "bold" },
  },
};

export const THEME_SETTING_KEY = "**colourScheme";

const ThemeContext = createContext<typeof DarkTheme | typeof LightTheme | null>(null);

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const { settings } = useSettings();

  // The app defaults to the dark theme; only an explicit "light" choice in
  // Settings switches it. This intentionally does not fall back to the OS
  // color scheme, per the product decision to always default to dark.
  const theme = settings[THEME_SETTING_KEY] === "light" ? LightTheme : DarkTheme;

  return (
    <ThemeContext.Provider value={theme}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
};
