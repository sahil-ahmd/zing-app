import { Stack, useRouter, useSegments } from "expo-router";
import "../global.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ClerkProvider, useAuth } from "@clerk/clerk-expo";
import { tokenCache } from "@clerk/clerk-expo/token-cache";
import { useEffect } from "react";
import AuthSync from "@/components/AuthSync";
import * as Sentry from "@sentry/react-native";

const isProd = !__DEV__;
const sentryDsn = process.env.EXPO_PUBLIC_SENTRY_DSN;

Sentry.init({
  dsn: sentryDsn ?? "",
  enabled: isProd && !!sentryDsn,

  // Adds more context data to events (IP address, cookies, user, etc.)
  // For more information, visit: https://docs.sentry.io/platforms/react-native/data-management/data-collected/
  sendDefaultPii: true,

  // Enable Logs
  enableLogs: true,

  // Configure Session Replay
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1,
  integrations: [
    Sentry.mobileReplayIntegration(),
    Sentry.reactNativeTracingIntegration({
      traceFetch: true,
      traceXHR: true,
      enableHTTPTimings: true,
    }),
  ],

  // uncomment the line below to enable Spotlight (https://spotlightjs.com)
  // spotlight: __DEV__,
});

const queryClient = new QueryClient();

function NavigationWrapper() {
  const { isLoaded, isSignedIn } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    // 1. Wait for Clerk to load
    if (!isLoaded) return;

    // 2. Determine where we are
    const inAuthGroup = segments[0] === "(auth)";
    const inTabsGroup = segments[0] === "(tabs)";

    // 3. Logic: If signed in, but NOT in the main app area
    if (isSignedIn) {
      if (
        !inTabsGroup &&
        segments[0] !== "chat" &&
        segments[0] !== "new-chat"
      ) {
        // Use timeout to ensure the router is ready to accept commands
        setTimeout(() => {
          router.replace("/(tabs)");
        }, 1);
      }
    }
    // 4. Logic: If NOT signed in, but NOT in the login area
    else if (!inAuthGroup) {
      setTimeout(() => {
        router.replace("/(auth)");
      }, 1);
    }
  }, [isSignedIn, isLoaded, segments]);

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(auth)" options={{ animation: "fade" }} />
      <Stack.Screen name="(tabs)" options={{ animation: "fade" }} />
      {/* Ensure these are registered here so they exist in the Stack */}
      <Stack.Screen
        name="new-chat/index"
        options={{
          animation: "slide_from_bottom",
          presentation: "modal",
          gestureEnabled: true,
        }}
      />
      <Stack.Screen name="chat/[id]" />
    </Stack>
  );
}

export default Sentry.wrap(function RootLayout() {
  return (
    <ClerkProvider tokenCache={tokenCache}>
      <QueryClientProvider client={queryClient}>
        <AuthSync />
        <NavigationWrapper />
      </QueryClientProvider>
    </ClerkProvider>
  );
});
