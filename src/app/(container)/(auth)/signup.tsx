// import { SignupScreenComponent } from "@/components/auth/auth-user/SignupScreenComponent";
import { StyleSheet } from "react-native";
import { Surface,Text } from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function Signup() {
  const { top } = useSafeAreaInsets();

  return (
    <Surface style={{ flex: 1, paddingTop: top + 10 }}>
      {/* <SignupScreenComponent /> */}
      <Text>Sign Up Screen</Text>
      {/* Placeholder for Signup Screen Component */}
      {/* <SignupScreenComponent /> */}
    </Surface>
  );
}

const styles = StyleSheet.create({

});
