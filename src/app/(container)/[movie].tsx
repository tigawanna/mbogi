import { Stack, useLocalSearchParams } from "expo-router";
import { Surface, Text } from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function MediaDetails() {
  const { top } = useSafeAreaInsets();
  const { movie, type } = useLocalSearchParams() as { movie: string; type?: string };
  const mediaId = parseInt(movie, 10);

  if (isNaN(mediaId)) {
    return null;
  }

  // Default to movie if no type specified
  const mediaType = type === "tv" ? "tv" : "movie";

  if (mediaType === "tv") {
    return (
      <Surface style={{ flex: 1, paddingTop: top + 12 }}>
        <Stack.Screen
          options={{
            headerShown: true,
          }}
        />
        <Text>TV Show Details for ID: {mediaId}</Text>
      </Surface>
    );
  }

  return (
    <Surface style={{ flex: 1, paddingTop: top + 12 }}>
      <Stack.Screen
        options={{
          headerShown: true,
        }}
      />
      <Text>Movie Details for ID: {mediaId}</Text>
    </Surface>
  );
}
