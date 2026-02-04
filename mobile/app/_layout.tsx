import { Redirect, Stack } from "expo-router";
import "../global.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ClerkProvider, SignedIn, SignedOut } from "@clerk/clerk-expo";
import { tokenCache } from "@clerk/clerk-expo/token-cache";

const queryClient = new QueryClient();

export default function RootLayout() {
  return (
    <ClerkProvider tokenCache={tokenCache}>
      <QueryClientProvider client={queryClient}>
        <SignedIn>
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="(tabs)" options={{ animation: "fade" }} />
          </Stack>
          <Redirect href="/(tabs)" />
        </SignedIn>

        <SignedOut>
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="(auth)" options={{ animation: "fade" }} />
          </Stack>
          <Redirect href="/(auth)" />
        </SignedOut>
        {/* <Stack
          screenOptions={{ 
            headerShown: false,
            contentStyle: {
              backgroundColor: "white"
            }
          }}
        >
          <Stack.Screen name="(auth)" options={{ animation: "fade" }} />
          <Stack.Screen name="(tabs)" options={{ animation: "fade" }} />
        </Stack> */}
      </QueryClientProvider>
    </ClerkProvider>
  );
}
