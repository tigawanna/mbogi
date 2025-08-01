import { MyWatchlistDetailScreen } from '@/components/screens/watchlist/mine/MyWatchlistDetailScreen';
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
      <MyWatchlistDetailScreen watchlistId={id} />
    </>
  );
}
