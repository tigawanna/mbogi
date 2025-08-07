import { TVDetailScreen } from "@/components/screens/discover/tv/TVDetailScreen";
import { Redirect, Stack, useLocalSearchParams } from "expo-router";
import { Surface } from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function MediaDetails() {
  const { show, img } = useLocalSearchParams() as { show: string ,img?: string};
  const { top, bottom } = useSafeAreaInsets();
  const mediaId = parseInt(show, 10);

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
      <TVDetailScreen tvId={mediaId} />
    </Surface>
  );
}
