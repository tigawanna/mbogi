/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

export const Colors = {
  light: {
    primary: "rgb(56, 112, 8)", // Deep green
    onPrimary: "rgb(255, 255, 255)",
    primaryContainer: "rgb(185, 245, 130)", // Light green
    onPrimaryContainer: "rgb(12, 30, 0)",
    secondary: "rgb(100, 255, 50)", // Neon green
    onSecondary: "rgb(0, 0, 0)", // Black for better contrast with neon
    secondaryContainer: "rgb(200, 255, 170)", // Pale neon
    onSecondaryContainer: "rgb(0, 30, 0)",
    tertiary: "rgb(80, 180, 80)", // Medium green
    onTertiary: "rgb(255, 255, 255)",
    tertiaryContainer: "rgb(180, 255, 180)", // Light mint
    tint: "rgb(200, 255, 200)", // Very light green tint
    onTertiaryContainer: "rgb(0, 30, 0)",
    error: "rgb(210, 47, 47)",
    onError: "rgb(255, 255, 255)",
    errorContainer: "rgb(255, 233, 230)",
    onErrorContainer: "rgb(65, 0, 2)",
    background: "rgb(252, 253, 248)",
    onBackground: "rgb(26, 28, 24)",
    surface: "rgb(252, 253, 248)",
    onSurface: "rgb(26, 28, 24)",
    surfaceVariant: "rgb(230, 233, 220)",
    onSurfaceVariant: "rgb(68, 72, 62)",
    outline: "rgb(118, 122, 112)",
    outlineVariant: "rgb(198, 201, 188)",
    shadow: "rgb(0, 0, 0)",
    scrim: "rgb(0, 0, 0)",
    inverseSurface: "rgb(47, 49, 44)",
    inverseOnSurface: "rgb(242, 242, 236)",
    inversePrimary: "rgb(140, 200, 80)",
    elevation: {
      level0: "transparent",
      level1: "rgb(245, 248, 238)",
      level2: "rgb(241, 245, 232)",
      level3: "rgb(237, 242, 225)",
      level4: "rgb(235, 241, 223)",
      level5: "rgb(231, 238, 218)",
    },
    surfaceDisabled: "rgba(26, 28, 24, 0.12)",
    onSurfaceDisabled: "rgba(26, 28, 24, 0.38)",
    backdrop: "rgba(45, 50, 40, 0.4)",
    icon: "rgb(26, 28, 24)",
  },

  dark: {
    primary: "rgb(140, 200, 80)", // Brighter green
    onPrimary: "rgb(15, 35, 0)", // Darker text
    primaryContainer: "rgb(30, 70, 0)", // Very dark green
    onPrimaryContainer: "rgb(185, 245, 130)",
    secondary: "rgb(80, 255, 40)", // Neon green
    onSecondary: "rgb(0, 10, 0)", // Very dark for contrast
    secondaryContainer: "rgb(0, 80, 0)", // Dark green
    onSecondaryContainer: "rgb(200, 255, 170)",
    tertiary: "rgb(100, 220, 100)", // Bright green
    tint: "rgb(100, 220, 100)", // Matching tertiary
    onTertiary: "rgb(0, 20, 0)",
    tertiaryContainer: "rgb(0, 60, 0)", // Very dark green
    onTertiaryContainer: "rgb(180, 255, 180)",
    error: "rgb(255, 180, 171)",
    onError: "rgb(105, 0, 5)",
    errorContainer: "rgb(147, 0, 10)",
    onErrorContainer: "rgb(255, 180, 171)",
    background: "rgb(15, 18, 12)", // Darker background
    onBackground: "rgb(228, 228, 222)",
    surface: "rgb(15, 18, 12)", // Darker surface
    onSurface: "rgb(228, 228, 222)",
    surfaceVariant: "rgb(50, 55, 45)", // Darker variant
    onSurfaceVariant: "rgb(180, 185, 170)", // Lighter text
    outline: "rgb(120, 125, 110)",
    outlineVariant: "rgb(50, 55, 45)",
    shadow: "rgb(0, 0, 0)",
    scrim: "rgb(0, 0, 0)",
    inverseSurface: "rgb(228, 228, 222)",
    inverseOnSurface: "rgb(40, 45, 35)", // Darker inverse
    inversePrimary: "rgb(56, 112, 8)",
    elevation: {
      level0: "transparent",
      level1: "rgb(25, 30, 20)", // Darker elevations
      level2: "rgb(30, 35, 22)",
      level3: "rgb(35, 40, 24)",
      level4: "rgb(36, 42, 25)",
      level5: "rgb(38, 46, 26)",
    },
    surfaceDisabled: "rgba(228, 228, 222, 0.12)",
    onSurfaceDisabled: "rgba(228, 228, 222, 0.38)",
    backdrop: "rgba(35, 40, 30, 0.4)", // Darker backdrop
    icon: "rgb(200, 205, 190)", // Slightly muted icons
  },
};

// igonre this when adapting colors
export const defaultPaperTheme = {
  light: {
    primary: "rgb(120, 69, 172)",
    onPrimary: "rgb(255, 255, 255)",
    primaryContainer: "rgb(240, 219, 255)",
    onPrimaryContainer: "rgb(44, 0, 81)",
    secondary: "rgb(102, 90, 111)",
    onSecondary: "rgb(255, 255, 255)",
    secondaryContainer: "rgb(237, 221, 246)",
    onSecondaryContainer: "rgb(33, 24, 42)",
    tertiary: "rgb(128, 81, 88)",
    onTertiary: "rgb(255, 255, 255)",
    tertiaryContainer: "rgb(255, 217, 221)",
    onTertiaryContainer: "rgb(50, 16, 23)",
    error: "rgb(186, 26, 26)",
    onError: "rgb(255, 255, 255)",
    errorContainer: "rgb(255, 218, 214)",
    onErrorContainer: "rgb(65, 0, 2)",
    background: "rgb(255, 251, 255)",
    onBackground: "rgb(29, 27, 30)",
    surface: "rgb(255, 251, 255)",
    onSurface: "rgb(29, 27, 30)",
    surfaceVariant: "rgb(233, 223, 235)",
    onSurfaceVariant: "rgb(74, 69, 78)",
    outline: "rgb(124, 117, 126)",
    outlineVariant: "rgb(204, 196, 206)",
    shadow: "rgb(0, 0, 0)",
    scrim: "rgb(0, 0, 0)",
    inverseSurface: "rgb(50, 47, 51)",
    inverseOnSurface: "rgb(245, 239, 244)",
    inversePrimary: "rgb(220, 184, 255)",
    elevation: {
      level0: "transparent",
      level1: "rgb(248, 242, 251)",
      level2: "rgb(244, 236, 248)",
      level3: "rgb(240, 231, 246)",
      level4: "rgb(239, 229, 245)",
      level5: "rgb(236, 226, 243)",
    },
    surfaceDisabled: "rgba(29, 27, 30, 0.12)",
    onSurfaceDisabled: "rgba(29, 27, 30, 0.38)",
    backdrop: "rgba(51, 47, 55, 0.4)",
  },
  dark: {
    primary: "rgb(220, 184, 255)",
    onPrimary: "rgb(71, 12, 122)",
    primaryContainer: "rgb(95, 43, 146)",
    onPrimaryContainer: "rgb(240, 219, 255)",
    secondary: "rgb(208, 193, 218)",
    onSecondary: "rgb(54, 44, 63)",
    secondaryContainer: "rgb(77, 67, 87)",
    onSecondaryContainer: "rgb(237, 221, 246)",
    tertiary: "rgb(243, 183, 190)",
    onTertiary: "rgb(75, 37, 43)",
    tertiaryContainer: "rgb(101, 58, 65)",
    onTertiaryContainer: "rgb(255, 217, 221)",
    error: "rgb(255, 180, 171)",
    onError: "rgb(105, 0, 5)",
    errorContainer: "rgb(147, 0, 10)",
    onErrorContainer: "rgb(255, 180, 171)",
    background: "rgb(29, 27, 30)",
    onBackground: "rgb(231, 225, 229)",
    surface: "rgb(29, 27, 30)",
    onSurface: "rgb(231, 225, 229)",
    surfaceVariant: "rgb(74, 69, 78)",
    onSurfaceVariant: "rgb(204, 196, 206)",
    outline: "rgb(150, 142, 152)",
    outlineVariant: "rgb(74, 69, 78)",
    shadow: "rgb(0, 0, 0)",
    scrim: "rgb(0, 0, 0)",
    inverseSurface: "rgb(231, 225, 229)",
    inverseOnSurface: "rgb(50, 47, 51)",
    inversePrimary: "rgb(120, 69, 172)",
    elevation: {
      level0: "transparent",
      level1: "rgb(39, 35, 41)",
      level2: "rgb(44, 40, 48)",
      level3: "rgb(50, 44, 55)",
      level4: "rgb(52, 46, 57)",
      level5: "rgb(56, 49, 62)",
    },
    surfaceDisabled: "rgba(231, 225, 229, 0.12)",
    onSurfaceDisabled: "rgba(231, 225, 229, 0.38)",
    backdrop: "rgba(51, 47, 55, 0.4)",
  },
};

export const defaultMaterial3PrimaryLightTheme = "#6750A4";
export const defaultMaterial3PrimaryDarkTheme = "#CFBCFF";
