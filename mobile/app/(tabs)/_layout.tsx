import { Redirect, Tabs } from "expo-router";
import TabBar from "@/components/TabBar";
import { useAuth } from "@clerk/clerk-expo";

const TabsLayout = () => {
  const { isSignedIn, isLoaded } = useAuth();

  if (!isLoaded) return null;
  if (!isSignedIn) return <Redirect href={"/(auth)"} />;
  
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
      /> 
    </Tabs>
  );
};

export default TabsLayout;
