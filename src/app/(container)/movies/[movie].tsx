import { MovieDetailScreen } from "@/components/screens/discover/movies/MovieDetailScreen";
import { Redirect, Stack, useLocalSearchParams } from "expo-router";
import { Surface } from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function MediaDetails() {
  const { top,bottom } = useSafeAreaInsets();
  const { movie } = useLocalSearchParams() as { movie: string };
  const mediaId = parseInt(movie, 10);

  if (isNaN(mediaId)) {
    return <Redirect href="/discover" />;
  }



  return (
    <Surface style={{ flex: 1, paddingTop: top, paddingBottom: bottom }}>
      <Stack.Screen
        options={{
          headerShown: false,
        }}
      />
      <MovieDetailScreen movieId={mediaId} />
    </Surface>
  );
}
