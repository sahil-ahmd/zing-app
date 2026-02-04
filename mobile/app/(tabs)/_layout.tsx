import { Redirect, Tabs } from "expo-router";
<<<<<<< Updated upstream
=======
import { Ionicons } from "@expo/vector-icons";
>>>>>>> Stashed changes
import TabBar from "@/components/TabBar";
import { useAuth } from "@clerk/clerk-expo";

const TabsLayout = () => {
  const { isSignedIn, isLoaded } = useAuth();

  if (!isLoaded) return null;
<<<<<<< Updated upstream
  if (!isSignedIn) return <Redirect href={"/(auth)"} />;
=======
  if (!isSignedIn) return <Redirect href={"/(tabs)"} />;
>>>>>>> Stashed changes
  
  return (
    <Tabs
      tabBar={(props) => <TabBar {...props} />}
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Chats",
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
        }}
      />
      <Tabs.Screen
        name="updates"
        options={{
          title: "Updates",
        }}
      />
      <Tabs.Screen
        name="community"
        options={{
          title: "Search",
        }}
<<<<<<< Updated upstream
      /> 
=======
      />
>>>>>>> Stashed changes
    </Tabs>
  );
};

export default TabsLayout;
