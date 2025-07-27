// import { LoadingFallback } from "@/components/state-screens/LoadingFallback";
// import { queryClient } from "@/lib/tanstack/client";
// import { useExtrenalDevTools } from "@/lib/tanstack/external-dev-tools";
// import { viewerQueryOptions } from "@/lib/tanstack/operations/user";
// import { useQuery } from "@tanstack/react-query";

import { LoadingFallback } from "@/components/state-screens/LoadingFallback";
import { queryClient } from "@/lib/tanstack/setup/client";
import { useExtrenalDevTools } from "@/lib/tanstack/setup/external-dev-tools";
import { Stack } from "expo-router";

// this grouped routes  (contaner) layout exists because tanstcak query provider is defined in the root layout making it hard to useQuery to check for logged i user in that layout

export default function ContainerLayout() {
  useExtrenalDevTools(queryClient);
  // const { data, isPending } = useQuery(viewerQueryOptions());
  const isPending = false;

  // const { isValidatingTokens, isTokensPresent } = useAuthState();
  // const { isPending: isVerifyingTokens, data: isVerifyingTokensData } = useQuery({
  //   queryKey: ["trakt_tokens_state"],
  //   queryFn: () => isTokensPresent(),
  // });

  if (isPending) {
    return <LoadingFallback />;
  }

  // User is authenticated if they have either PocketBase auth or Trakt auth
  const isAuthenticated = true;

  return (
    <Stack>
      <Stack.Protected guard={isAuthenticated}>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </Stack.Protected>
      {/* <Stack.Screen name="(auth)" options={{ headerShown: false }} /> */}
      <Stack.Protected guard={!isAuthenticated}>
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
      </Stack.Protected>
      {/* <Stack.Screen name="(auth)/signup" options={{ headerShown: false }} /> */}
    </Stack>
  );
}
