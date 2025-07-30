import { WatchlistDetailScreen } from '@/components/screens/watchlist/shared/WatchlistDetailScreen';
import { Stack, useLocalSearchParams } from 'expo-router';

export default function WatchlistPage() {
  const { id } = useLocalSearchParams<{ id: string }>();

  if (!id) {
    return null;
  }

  return (
    <>
      <Stack.Screen
        options={{
          title: 'Watchlist',
          headerShown: true,
        }}
      />
      <WatchlistDetailScreen watchlistId={id} />
    </>
  );
}
