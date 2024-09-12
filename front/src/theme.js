import { createContext, useState, useMemo } from "react";
import { createTheme } from "@mui/material/styles";

// Updated color design tokens export
export const tokens = (mode) => ({
  ...(mode === "dark"
    ? {
        grey: {
          100: "#d3d3d3",
          200: "#a6a6a6",
          300: "#7a7a7a",
          400: "#4d4d4d",
          500: "#2e2e2e",
          600: "#1e1e1e",
          700: "#141414",
          800: "#0a0a0a",
          900: "#000000",
        },
        primary: {
          100: "#242424",
          200: "#1e1e1e",
          300: "#181818",
          400: "#121212",
          500: "#0e0e0e",
          600: "#0a0a0a",
          700: "#050505",
          800: "#030303",
          900: "#000000",
        },
        orangeAccent: {
          100: "#ffd7b3",
          200: "#ffae66",
          300: "#ff8533",
          400: "#ff5c00",
          500: "#e65100", // Dark Orange
          600: "#b74100",
          700: "#883100",
          800: "#592100",
          900: "#2b1100",
        },
      }
    : {
        grey: {
          100: "#f0f0f0",
          200: "#e0e0e0",
          300: "#d1d1d1",
          400: "#c2c2c2",
          500: "#b3b3b3",
          600: "#a3a3a3",
          700: "#939393",
          800: "#838383",
          900: "#737373",
        },
        primary: {
          100: "#ffffff", // Pure White
          200: "#f7f7f7",
          300: "#f0f0f0",
          400: "#e9e9e9",
          500: "#e0e0e0",
          600: "#bfbfbf",
          700: "#9e9e9e",
          800: "#7d7d7d",
          900: "#5c5c5c",
        },
        orangeAccent: {
          100: "#ffe6cc",
          200: "#ffcc99",
          300: "#ffb366",
          400: "#ff9933",
          500: "#ff8000", // Vibrant Orange
          600: "#cc6600",
          700: "#994c00",
          800: "#663300",
          900: "#331900",
        },
      }),
});

// MUI theme settings
export const themeSettings = (mode) => {
  const colors = tokens(mode);
  return {
    palette: {
      mode: mode,
      ...(mode === "dark"
        ? {
            // Palette values for dark mode
            primary: {
              main: colors.primary[500],
            },
            secondary: {
              main: colors.orangeAccent[500],
            },
            neutral: {
              dark: colors.grey[700],
              main: colors.grey[500],
              light: colors.grey[100],
            },
            background: {
              default: colors.primary[500],
            },
          }
        : {
            // Palette values for light mode
            primary: {
              main: colors.primary[100],
            },
            secondary: {
              main: colors.orangeAccent[500],
            },
            neutral: {
              dark: colors.grey[700],
              main: colors.grey[500],
              light: colors.grey[100],
            },
            background: {
              default: "#f8f8f8",
            },
          }),
    },
    typography: {
      fontFamily: ["Source Sans Pro", "sans-serif"].join(","),
      fontSize: 12,
      h1: {
        fontFamily: ["Source Sans Pro", "sans-serif"].join(","),
        fontSize: 40,
      },
      h2: {
        fontFamily: ["Source Sans Pro", "sans-serif"].join(","),
        fontSize: 32,
      },
      h3: {
        fontFamily: ["Source Sans Pro", "sans-serif"].join(","),
        fontSize: 24,
      },
      h4: {
        fontFamily: ["Source Sans Pro", "sans-serif"].join(","),
        fontSize: 20,
      },
      h5: {
        fontFamily: ["Source Sans Pro", "sans-serif"].join(","),
        fontSize: 16,
      },
      h6: {
        fontFamily: ["Source Sans Pro", "sans-serif"].join(","),
        fontSize: 14,
      },
    },
  };
};

// Context for color mode
export const ColorModeContext = createContext({
  toggleColorMode: () => {},
});

// Updated useMode Hook
export const useMode = () => {
  const [mode, setMode] = useState("light"); // Default to light mode

  const colorMode = useMemo(
    () => ({
      toggleColorMode: () =>
        setMode((prev) => (prev === "light" ? "dark" : "light")),
    }),
    []
  );

  const theme = useMemo(() => createTheme(themeSettings(mode)), [mode]);
  return [theme, colorMode];
};
