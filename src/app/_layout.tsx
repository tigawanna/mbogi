import "react-native-reanimated";
import { asyncStoragePersister, queryClient } from "@/lib/tanstack/query/client";
import { useAppState, useOnlineManager } from "@/lib/tanstack/query/react-native-setup-hooks";
import { focusManager } from "@tanstack/react-query";
import { useFonts } from "expo-font";
import { Slot } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import React, { useEffect } from "react";
import { AppStateStatus, Platform } from "react-native";

import { GlobalSnackbar } from "@/components/react-native-paper/snackbar/GlobalSnackbar";
import { useThemeSetup } from "@/hooks/theme/use-theme-setup";
import { useSettingsStore } from "@/store/settings-store";
import { DarkTheme, DefaultTheme, ThemeProvider } from "@react-navigation/native";
import { PersistQueryClientProvider } from "@tanstack/react-query-persist-client";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { PaperProvider } from "react-native-paper";

import { useNetworkActivityDevTools } from "@rozenite/network-activity-plugin";
import { useTanStackQueryDevTools } from "@rozenite/tanstack-query-plugin";

SplashScreen.preventAutoHideAsync();

function onAppStateChange(status: AppStateStatus) {
  // React Query already supports in web browser refetch on window focus by default
  if (Platform.OS !== "web") {
    focusManager.setFocused(status === "active");
  }
}

export default function RootLayout() {
  useNetworkActivityDevTools();
  useOnlineManager();
  useAppState(onAppStateChange);
  useTanStackQueryDevTools(queryClient);
  const { dynamicColors } = useSettingsStore();
  const { colorScheme, paperTheme } = useThemeSetup(dynamicColors);

  const [loaded] = useFonts({
    SpaceMono: require("@/assets/fonts/SpaceMono-Regular.ttf"),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    // Async font loading only occurs in development.
    return null;
  }

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <PaperProvider theme={paperTheme}>
        <GestureHandlerRootView style={{ flex: 1 }}>
          <StatusBar style={colorScheme === "dark" ? "light" : "dark"} />
          <PersistQueryClientProvider
            client={queryClient}
            persistOptions={{ persister: asyncStoragePersister }}>
            <Slot />
          </PersistQueryClientProvider>
          <GlobalSnackbar />
        </GestureHandlerRootView>
      </PaperProvider>
    </ThemeProvider>
  );
}

