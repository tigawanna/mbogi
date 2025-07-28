import { ProfileScreenComponent } from "@/components/auth/profile/ProfileScreenComponent";
import { StyleSheet } from "react-native";
import { Surface } from "react-native-paper";

export default function Profile() {
  return (
    <Surface style={{ ...styles.container }}>
    <ProfileScreenComponent />
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
