export const COMMON_GENRES = [
  { id: 28, name: "Action" },
  { id: 12, name: "Adventure" },
  { id: 16, name: "Animation" },
  { id: 35, name: "Comedy" },
  { id: 80, name: "Crime" },
  { id: 99, name: "Documentary" },
  { id: 18, name: "Drama" },
  { id: 10751, name: "Family" },
  { id: 14, name: "Fantasy" },
  { id: 36, name: "History" },
  { id: 27, name: "Horror" },
  { id: 10402, name: "Music" },
  { id: 9648, name: "Mystery" },
  { id: 10749, name: "Romance" },
  { id: 878, name: "Science Fiction" },
  { id: 10770, name: "TV Movie" },
  { id: 53, name: "Thriller" },
  { id: 10752, name: "War" },
  { id: 37, name: "Western" },
] as const;

interface WatchlistItem {
  genre_ids?: any[] | Record<string, any> | null;
}

/**
 * Analyzes genres from watchlist items and returns a descriptive text
 * @param items Array of watchlist items with genre_ids
 * @returns Formatted genre description text
 */
export function analyzeWatchlistGenres(items: WatchlistItem[]): string {
  if (!items || items.length === 0) {
    return "";
  }

  // Count genre occurrences
  const genreCount = new Map<number, number>();
  
  items.forEach(item => {
    if (item.genre_ids && Array.isArray(item.genre_ids)) {
      item.genre_ids.forEach(genreId => {
        if (typeof genreId === 'number') {
          genreCount.set(genreId, (genreCount.get(genreId) || 0) + 1);
        }
      });
    }
  });

  if (genreCount.size === 0) {
    return "";
  }

  // Sort genres by count (descending)
  const sortedGenres = Array.from(genreCount.entries())
    .sort(([, a], [, b]) => b - a)
    .map(([genreId, count]) => ({
      id: genreId,
      name: COMMON_GENRES.find(g => g.id === genreId)?.name || 'Unknown',
      count,
      percentage: (count / items.length) * 100
    }))
    .filter(genre => genre.name !== 'Unknown');

  if (sortedGenres.length === 0) {
    return "";
  }

  // Check if one genre is dominant (>40% of items)
  const dominantGenre = sortedGenres[0];
  if (dominantGenre.percentage > 40) {
    return `Mostly ${dominantGenre.name.toLowerCase()}`;
  }

  // Check if two genres are significant (together >50% of items)
  if (sortedGenres.length >= 2) {
    const topTwo = sortedGenres.slice(0, 2);
    const combinedPercentage = topTwo.reduce((sum, genre) => sum + genre.percentage, 0);
    
    if (combinedPercentage > 50) {
      return `${topTwo[0].name} & ${topTwo[1].name.toLowerCase()}`;
    }
  }

  // Otherwise show top 3 genres
  const topThree = sortedGenres.slice(0, 3);
  if (topThree.length === 1) {
    return topThree[0].name;
  } else if (topThree.length === 2) {
    return `${topThree[0].name} & ${topThree[1].name.toLowerCase()}`;
  } else {
    return `${topThree[0].name}, ${topThree[1].name.toLowerCase()}, ${topThree[2].name.toLowerCase()}`;
  }
}

/**
 * Gets the name of a genre by its ID
 * @param genreId The TMDB genre ID
 * @returns The genre name or null if not found
 */
export function getGenreName(genreId: number): string | null {
  return COMMON_GENRES.find(g => g.id === genreId)?.name || null;
}

/**
 * Gets multiple genre names from an array of IDs
 * @param genreIds Array of TMDB genre IDs
 * @returns Array of genre names
 */
export function getGenreNames(genreIds: number[]): string[] {
  return genreIds
    .map(id => getGenreName(id))
    .filter((name): name is string => name !== null);
}
