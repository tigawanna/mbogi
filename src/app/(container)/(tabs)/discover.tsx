import React from "react";
import { View } from "react-native";
import { Surface, Text } from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function DiscoverRoute() {
  const { top } = useSafeAreaInsets();
  return (
    <Surface style={{ flex: 1, paddingTop: top + 12 }}>
    <Text>Discover Screen</Text>
    </Surface>
  );
}
