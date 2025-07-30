import { PersonDetailScreen } from "@/components/screens/discover/person/PersonDetailScreen";
import { Redirect, Stack, useLocalSearchParams } from "expo-router";
import { Surface } from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function MediaDetails() {
  const { top } = useSafeAreaInsets();
  const { person } = useLocalSearchParams() as { person: string; type?: string };
  const personId = parseInt(person, 10);

  if (isNaN(personId)) {
    return <Redirect href="/discover" />;
  }

  return (
    <Surface style={{ flex: 1, paddingTop: top }}>
      <Stack.Screen
        options={{
          headerShown:false
        }}
      />

      <PersonDetailScreen personId={personId} />
    </Surface>
  );
}
