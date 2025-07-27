import { SignupScreenComponent } from "@/components/auth/auth-user/SignupScreenComponent";
import { StyleSheet } from "react-native";
import { Surface } from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function Signup() {
  const { top } = useSafeAreaInsets();

  return (
    <Surface style={{ flex: 1, paddingTop: top + 10 }}>
      <SignupScreenComponent />
    </Surface>
  );
}

const styles = StyleSheet.create({

});
