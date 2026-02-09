import { Stack, useRouter, useSegments } from "expo-router";
import "../global.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ClerkProvider, useAuth } from "@clerk/clerk-expo";
import { tokenCache } from "@clerk/clerk-expo/token-cache";
import { useEffect } from "react";
import AuthSync from "@/components/AuthSync";

const queryClient = new QueryClient();

function NavigationWrapper() {
  const { isLoaded, isSignedIn } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (!isLoaded) return;

    const inTabsGroup = segments[0] === "(tabs)";

    if (isSignedIn && !inTabsGroup) {
      router.replace("/(tabs)");
    } else if (!isSignedIn && inTabsGroup) {
      router.replace("/(auth)");
    }
  }, [isSignedIn, isLoaded, segments]);

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: "white" },
      }}
    >
      <Stack.Screen name="(auth)" options={{ animation: "fade" }} />
      <Stack.Screen name="(tabs)" options={{ animation: "fade" }} />
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <ClerkProvider tokenCache={tokenCache}>
      <QueryClientProvider client={queryClient}>
        <AuthSync />
        <NavigationWrapper />
      </QueryClientProvider>
    </ClerkProvider>
  );
}
