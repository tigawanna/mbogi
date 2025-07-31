import Constants from "expo-constants";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useSyncQueriesExternal } from "react-query-external-sync";
import { QueryClient } from "@tanstack/react-query";
import { Platform } from "react-native";
// Get the host IP address dynamically
const hostIP =
  Constants.expoGoConfig?.debuggerHost?.split(`:`)[0] ||
  Constants.expoConfig?.hostUri?.split(`:`)[0];

export function useExtrenalDevTools(queryClient: QueryClient) {
    useSyncQueriesExternal({
      queryClient,
      socketURL: `http://${hostIP}:42831`, // Use local network IP
      deviceName: Platform?.OS || "web",
      platform: Platform?.OS || "web",
      deviceId: Platform?.OS || "web",
      extraDeviceInfo: {
        appVersion: "1.0.0",
      },
      enableLogs: false,
      envVariables: {
        NODE_ENV: process.env.NODE_ENV,
      },
      // Storage monitoring
    //   mmkvStorage: storage,
      asyncStorage: AsyncStorage,
    //   secureStorage: SecureStore,
    //   secureStorageKeys: ["userToken", "refreshToken"],
    });
}


export const TSQ_CACHE_TIME = __DEV__ ? 1000 : 1000 * 60 * 60 * 72; // 1 sec in dev, 72 hours in production
