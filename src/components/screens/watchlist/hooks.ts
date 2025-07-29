import { useLocalSearchParams, router } from "expo-router";
import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

export function useWatchlistSearch() {
  const { query } = useLocalSearchParams<{ query: string }>();
  return {
    searchQuery: query || "",
    setSearchQuery: (query: string) => {
      router.setParams({ query });
    },
  };
}

interface watchlistSettings {
  orientation: "list" | "grid";
  setOrientation: (orientation: "list" | "grid") => void;
}

export const usewatchlistSettingsStore = create<watchlistSettings>()(
  devtools(
    persist(
      (set) => ({
        orientation: "list",
        setOrientation: (orientation) => set({ orientation }),
      }),
      {
        name: "watchlist-settings",
      }
    )
  )
);
