import { Redirect, Stack, useRouter, useSegments } from "expo-router";
import "../global.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ClerkProvider, SignedIn, SignedOut, useAuth } from "@clerk/clerk-expo";
import { tokenCache } from "@clerk/clerk-expo/token-cache";
import { useEffect } from "react";

const queryClient = new QueryClient();

export default function RootLayout() {
  const { isLoaded, isSignedIn } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (!isLoaded) return;

    const inTabsGroup = segments[0] === "(tabs)";

    if (isSignedIn && !inTabsGroup) {
      // Redirect to tabs if signed in but not there
      router.replace("/(tabs)");
    } else if (!isSignedIn && inTabsGroup) {
      // Redirect to auth if not signed in but trying to access tabs
      router.replace("/(auth)");
    }
  }, [isSignedIn, isLoaded, segments]);

  return (
    <ClerkProvider tokenCache={tokenCache}>
      <QueryClientProvider client={queryClient}>
        <Stack
          screenOptions={{ 
            headerShown: false,
            contentStyle: {
              backgroundColor: "white"
            }
          }}
        >
          <Stack.Screen name="(auth)" options={{ animation: "fade" }} />
          <Stack.Screen name="(tabs)" options={{ animation: "fade" }} />
        </Stack>
      </QueryClientProvider>
    </ClerkProvider>
  );
}
