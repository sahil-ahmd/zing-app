import { useSSO } from "@clerk/clerk-expo";
import * as Linking from "expo-linking";
import { useState } from "react";
import { Alert } from "react-native";

function useSocialAuth() {
  const [loadingStrategy, setLoadingStrategy] = useState<string | null>(null);
  const { startSSOFlow } = useSSO();

  const handleSocialAuth = async (strategy: "oauth_google" | "oauth_apple") => {
    if (loadingStrategy) return; // Guard against concurrent flows
    setLoadingStrategy(strategy);

    try {
      const { createdSessionId, setActive } = await startSSOFlow({
        strategy,
        redirectUrl: Linking.createURL("/(tabs)"),
      });
      
      if (createdSessionId && setActive) {
        await setActive({ session: createdSessionId });
      } else {
        const provider = strategy === "oauth_google" ? "Google" : "Apple";
        Alert.alert(
          "Sign-in incomplete",
          `${provider} sign-in did not complete. Please try again.`
        );
        return;
      }
    } catch (error: any) {
      console.log("Error in social auth: ", error);
      // Don't alert if the user just cancelled the popup
      if (error.code !== "auth_cancelled") {
        const provider = strategy === "oauth_google" ? "Google" : "Apple";
        Alert.alert("Error", error.message || `Failed to sign in with ${provider}.`);
      }
    } finally {
      setLoadingStrategy(null);
    }
  };

  return { handleSocialAuth, loadingStrategy};
}

export default useSocialAuth;