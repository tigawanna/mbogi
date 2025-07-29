import React from "react";
import { Surface } from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { StyleSheet } from "react-native";
import { CommunityWatchlistScreen } from "@/components/screens/watchlist/community/CommunityWatchlistScreen";

export default function CommunityRoute() {
  const { top } = useSafeAreaInsets();
  return (
    <Surface style={[styles.container, { paddingTop: top + 12 }]}>
      <CommunityWatchlistScreen />
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
