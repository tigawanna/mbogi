import { MovieDetailScreen } from "@/components/screens/discover/movies/MovieDetailScreen";
import { Redirect, Stack, useLocalSearchParams } from "expo-router";
import { Surface, Text } from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function MediaDetails() {
  const { top } = useSafeAreaInsets();
  const { movie, type } = useLocalSearchParams() as { movie: string; type?: string };
  const mediaId = parseInt(movie, 10);

  if (isNaN(mediaId)) {
    return <Redirect href="/discover" />;
  }



  return (
    <Surface style={{ flex: 1, paddingTop: top + 12 }}>
      <Stack.Screen
        options={{
          headerShown: true,
        }}
      />
      <MovieDetailScreen movieId={mediaId} />
    </Surface>
  );
}
