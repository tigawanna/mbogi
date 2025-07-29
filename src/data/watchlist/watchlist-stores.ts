import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
interface PageOptions {
  page: number;
  totalPages: number;
  totalItems?: number;
}
interface BearState {
  options: PageOptions;
  setOptions: (options: PageOptions) => void;
}

export const useCommunityWatchListPageoptionsStore = create<BearState>()(
    persist(
      (set) => ({
        options: {
          page: -1,
          totalPages: -1,
            totalItems: -1,
        },
        setOptions: (options) => set({ options }),
      }),
      {
        name: "community-watchlist-page-options",
        storage: createJSONStorage(() => AsyncStorage),
        // Only persist the state, not the actions
        partialize: (state) => ({
          options: state.options,
        }),
      }
    )
  )

