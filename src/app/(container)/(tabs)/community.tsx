
import React from "react";
import { Surface,Text } from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";


export default function CommunityRoute() {
  const { top } = useSafeAreaInsets();
  return (
    <Surface style={{ flex: 1, paddingTop: top + 12 }}>
      <Text>Communuty Screen</Text>
    </Surface>
  );
}
