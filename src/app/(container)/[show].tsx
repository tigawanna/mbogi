import { Stack, useLocalSearchParams } from "expo-router";
import { Surface,Text } from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function MediaDetails() {
  const { show, type } = useLocalSearchParams() as { show: string; type?: string };
  const { top } = useSafeAreaInsets();
  const mediaId = parseInt(show, 10);

  if (isNaN(mediaId)) {
    return null;
  }
  
  // Default to tv if no type specified
  const mediaType = type === "movie" ? "movie" : "tv";
  
  if (mediaType === "tv") {
    return (
      <Surface style={{ flex: 1, paddingTop: top + 12 }}>
        <Stack.Screen options={{
          headerShown: true,
        }}/>
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
