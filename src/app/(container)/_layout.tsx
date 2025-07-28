import { LoadingFallback } from "@/components/state-screens/LoadingFallback";
import { viewerQueryOptions } from "@/data/viewer/query-options";
import { queryClient } from "@/lib/tanstack/query/client";
import { useExtrenalDevTools } from "@/lib/tanstack/query/external-dev-tools";
import { useQuery } from "@tanstack/react-query";
import { Stack } from "expo-router";

// this grouped routes  (contaner) layout exists because tanstcak query provider is defined in the root layout making it hard to useQuery to check for logged i user in that layout

export default function ContainerLayout() {
  useExtrenalDevTools(queryClient);
  const { data, isPending } = useQuery(viewerQueryOptions());

  if (isPending) {
    return <LoadingFallback />;
  }

  // User is authenticated if they have either PocketBase auth or Trakt auth
  const isAuthenticated = !!data?.id;

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
