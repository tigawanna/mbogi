import { addTowatchListMutationOptions } from "@/data/discover/old-tmdb-operations/operations-options";
import { useMutation } from "@tanstack/react-query";
import { StyleSheet } from "react-native";
import { Text, Surface } from "react-native-paper";

export default function TestScreen() {
  const addTowatchList = useMutation(addTowatchListMutationOptions());
  return (
    <Surface style={{ ...styles.container }}>
      <Text variant="titleLarge">test</Text>
    </Surface>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: "100%",
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
});
