import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

export type ViewMode = 'grid' | 'list';

export interface ViewPreferences {
  // Discover views
  discoverMovies: ViewMode;
  discoverTV: ViewMode;
  
  // Search views
  search: ViewMode;

  
  // Community/My watchlist views
  myWatchlist: ViewMode;
  communityWatchlist: ViewMode;
}

interface ViewPreferencesState {
  preferences: ViewPreferences;
  
  // Actions
  setViewMode: (key: keyof ViewPreferences, mode: ViewMode) => void;
  getViewMode: (key: keyof ViewPreferences) => ViewMode;
  resetToDefaults: () => void;
}

const DEFAULT_PREFERENCES: ViewPreferences = {
  // Default to grid for discovery (more visual)
  discoverMovies: 'grid',
  discoverTV: 'grid',
  
  // Default to list for search (more information dense)
  search: 'list',

  // Default to grid for watchlists (more visual)
  myWatchlist: 'grid',
  communityWatchlist: 'grid',
};

export const useViewPreferencesStore = create<ViewPreferencesState>()(
  devtools(
    persist(
      (set, get) => ({
        preferences: DEFAULT_PREFERENCES,

        setViewMode: (key, mode) =>
          set((state) => ({
            preferences: {
              ...state.preferences,
              [key]: mode,
            },
          })),

        getViewMode: (key) => get().preferences[key],

        resetToDefaults: () =>
          set({
            preferences: DEFAULT_PREFERENCES,
          }),
      }),
      {
        name: 'view-preferences-storage',
        version: 1,
      }
    ),
    {
      name: 'ViewPreferencesStore',
    }
  )
);

// Convenience hooks for specific views
export const useDiscoverMoviesViewMode = () => {
  const { preferences, setViewMode } = useViewPreferencesStore();
  return {
    viewMode: preferences.discoverMovies,
    setViewMode: (mode: ViewMode) => setViewMode('discoverMovies', mode),
  };
};

export const useDiscoverTVViewMode = () => {
  const { preferences, setViewMode } = useViewPreferencesStore();
  return {
    viewMode: preferences.discoverTV,
    setViewMode: (mode: ViewMode) => setViewMode('discoverTV', mode),
  };
};

export const useSearchResultsViewMode = () => {
  const { preferences, setViewMode } = useViewPreferencesStore();
  return {
    viewMode: preferences.search,
    setViewMode: (mode: ViewMode) => setViewMode('search', mode),
  };
};


