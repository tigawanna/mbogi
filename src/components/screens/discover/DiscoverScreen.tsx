import React, { useState } from 'react';
import { StyleSheet, useWindowDimensions, View } from 'react-native';
import { Searchbar, useTheme } from 'react-native-paper';
import { Tabs, TabScreen, TabsProvider } from 'react-native-paper-tabs';

import { DiscoverMoviesScreen } from './movies/DiscoverMoviesScreen';
import { SearchMoviesScreen } from './search/SearchMoviesScreen';
import { SearchPersonScreen } from './search/SearchPersonScreen';
import { SearchTVScreen } from './search/SearchTVScreen';
import { DiscoverTVScreen } from './tv/DiscoverTVScreen';

export function DiscoverScreen() {
  const { colors } = useTheme();
  const { width } = useWindowDimensions();
  const [searchQuery, setSearchQuery] = useState('');

  // Show search results if there's a search query
  if (searchQuery.trim().length > 0) {
    return (
      <View style={styles.container}>
        <Searchbar
          placeholder="Search movies, TV shows, people..."
          onChangeText={setSearchQuery}
          value={searchQuery}
          style={[styles.searchBar, { width: width * 0.95 }]}
          inputStyle={styles.searchInput}
          iconColor={colors.onSurfaceVariant}
          placeholderTextColor={colors.onSurfaceVariant}
        />
        
        <TabsProvider defaultIndex={0}>
          <Tabs
            mode="scrollable"
            showLeadingSpace={true}
            style={{ backgroundColor: colors.surface }}
          >
            <TabScreen label="Movies" icon="movie">
              <SearchMoviesScreen searchQuery={searchQuery} />
            </TabScreen>
            <TabScreen label="TV Shows" icon="television">
              <SearchTVScreen searchQuery={searchQuery} />
            </TabScreen>
            <TabScreen label="People" icon="account">
              <SearchPersonScreen searchQuery={searchQuery} />
            </TabScreen>
          </Tabs>
        </TabsProvider>
      </View>
    );
  }

  // Show discover tabs when no search query
  return (
    <View style={styles.container}>
      <Searchbar
        placeholder="Search movies, TV shows, people..."
        onChangeText={setSearchQuery}
        value={searchQuery}
        style={[styles.searchBar, { width: width * 0.95 }]}
        inputStyle={styles.searchInput}
        iconColor={colors.onSurfaceVariant}
        placeholderTextColor={colors.onSurfaceVariant}
      />
      
      <TabsProvider defaultIndex={0}>
        <Tabs
          mode="fixed"
          style={{ backgroundColor: colors.surface }}
        >
          <TabScreen label="Movies" icon="movie">
            <DiscoverMoviesScreen />
          </TabScreen>
          <TabScreen label="TV Shows" icon="television">
            <DiscoverTVScreen />
          </TabScreen>
        </Tabs>
      </TabsProvider>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
  },
  searchBar: {
    elevation: 0,
    marginHorizontal: 8,
    marginVertical: 8,
  },
  searchInput: {
    fontSize: 16,
    width: '100%',
  },
});
