import React from "react";
import {StyleSheet } from "react-native";
import { Surface, Text } from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function DiscoverRoute() {
  const { top } = useSafeAreaInsets();
  return (
    <Surface style={[styles.container, { paddingTop: top + 12 }]}>
      <Text>Discover Screen</Text>
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
