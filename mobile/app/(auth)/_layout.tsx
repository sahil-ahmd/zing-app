import { useAuth } from "@clerk/clerk-expo";
import { Href, Redirect, Stack } from "expo-router";

const AuthLayout = () => {
  // const { isSignedIn, isLoaded } = useAuth();

  // if (!isLoaded) return null;

  // if (isSignedIn) {
  //   return <Redirect href={"/(tabs)" as Href} />;
  // }

  return (
    <Stack screenOptions={{ headerShown: false }} />
  );
};

export default AuthLayout;
