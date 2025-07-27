import React from "react";
import { Surface, Text } from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { StyleSheet } from "react-native";

export default function CommunityRoute() {
  const { top } = useSafeAreaInsets();
  return (
    <Surface style={[styles.container, { paddingTop: top + 12 }]}>
      <Text>Community Screen</Text>
    </Surface>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
