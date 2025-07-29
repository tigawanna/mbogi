
import { GoogleSvg } from "@/components/shared/svg/GoogleSvg";
import { pb } from "@/lib/pb/client";

import { useMutation, useQuery } from "@tanstack/react-query";
import * as Linking from "expo-linking";
import * as WebBrowser from "expo-web-browser";
import { Platform, Pressable, StyleSheet, View } from "react-native";
import { Text, useTheme } from "react-native-paper";
import { LoadingIndicatorDots } from "@/components/state-screens/LoadingIndicatorDots";
import { viewerQueryOptions } from "@/data/viewer/query-options";

export function OauthLogin() {
  const { colors } = useTheme();
  const { data, isPending: isCurrentUserPending } = useQuery(viewerQueryOptions());

 // const watchedEmail = watch("email");

  const loginWithGoogle = () => {
    if (Platform.OS === "web") {
      return pb.collection("users").authWithOAuth2({
        provider: "google",
      });
    }
    return pb.collection("users").authWithOAuth2({
      provider: "google",
      urlCallback(url: string) {
        WebBrowser.openAuthSessionAsync(url, Linking.createURL("/")).then((res) => {
          if (Platform.OS === "ios") {
            WebBrowser.dismissAuthSession();
          }
        });
      },
    });
  };
  const { mutate, isPending, isSuccess } = useMutation({
    mutationFn: () => {
      return loginWithGoogle();
    },
    onSuccess: (data) => {

    },
    onError: (error) => {
      console.log("Login failed", error.message);
    },
    meta: {
      invalidates: [["viewer"]],
    },
  });
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        {/* Header Section */}
        {/* <View style={styles.header}>
          <Text variant="displaySmall" style={[styles.title, { color: colors.onSurface }]}>
            Welcome to Moots
          </Text>
          <Text variant="bodyLarge" style={[styles.subtitle, { color: colors.onSurfaceVariant }]}>
            Your movie social network
          </Text>
          <AppLogoSvg />
        </View> */}

        {/* Login Card */}


        <Pressable
          onPress={() => mutate()}
          disabled={isPending}
          style={({ pressed }) => [
            styles.loginButton,
            {
              backgroundColor: pressed ? colors.primaryContainer : colors.surface,
              borderColor: colors.primary,
              opacity: isPending ? 0.4 : 1,
            },
          ]}>
          {isPending ? (
            <View style={{}}>
              <LoadingIndicatorDots />
            </View>
          ) : (
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 12,
              }}>
              {/* <TraktSvg width={24} height={24} /> */}
              <GoogleSvg width={24} height={24} />
              <Text variant="titleMedium" style={[styles.buttonText, { color: colors.primary }]}>
                Continue with Google
              </Text>
            </View>
          )}
        </Pressable>
        <View style={styles.footer}>
          <Text variant="bodySmall" style={[styles.footerText, { color: colors.onSurfaceVariant }]}>
            By signing in, you agree to our Terms of Service and Privacy Policy
          </Text>
        </View>
      </View>

      {!data && isCurrentUserPending && isSuccess && (
        <View style={styles.globalLoading}>
          <LoadingIndicatorDots />
        </View>
      )}
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    // flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 16,
  },

  loginButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 16,
    gap: 12,
    elevation: 4,
  },
  buttonText: {
    fontWeight: "600",
    textAlign: "center",
  },

  footer: {
    alignItems: "center",
  },
  footerText: {
    textAlign: "center",
    lineHeight: 18,
    opacity: 0.7,
  },
  globalLoading: {
    position: "absolute",
    bottom: 40,
    left: 0,
    right: 0,
    alignItems: "center",
  },
});
