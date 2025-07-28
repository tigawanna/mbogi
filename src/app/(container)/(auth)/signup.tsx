// import { SignupScreenComponent } from "@/components/auth/auth-user/SignupScreenComponent";
import { SignupScreen } from "@/components/auth/auth-user/signup/SignupScreen";
import { StyleSheet } from "react-native";
import { Surface, Text } from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function Signup() {
  const { top } = useSafeAreaInsets();

  return (
    <Surface style={{ ...styles.container, paddingTop: top }}>
      <SignupScreen />
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

