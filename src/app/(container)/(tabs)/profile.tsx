import { StyleSheet } from "react-native";
import { Surface,Text } from "react-native-paper";

export default function Profile() {
  return (
    <Surface style={{ ...styles.container }}>
      <Text>Profile Screen</Text>
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
