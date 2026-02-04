import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import TabBar from "@/components/TabBar";

const TabsLayout = () => {
  return (
    // <Tabs
    //   screenOptions={{
    //     headerShown: false,
    //     tabBarStyle: {
    //       backgroundColor: "#faf9f6",
    //       borderTopColor: "#f9f6ee",
    //       borderWidth: 1,
    //       height: 60,
    //       padding: 2,
    //       marginBottom: 6,
    //       width: "96%",
    //       borderRadius: 999,
    //       alignSelf: "center",
    //     },
    //     tabBarActiveTintColor: "#C2E969",
    //     tabBarInactiveTintColor: "#D3D3D3",
    //     tabBarLabelStyle: {
    //       fontSize: 14,
    //       fontWeight: "600",
    //       color: "#2C3249",
    //     },
    //   }}
    // >
    //   <Tabs.Screen
    //     name="index"
    //     options={{
    //       title: "Chats",
    //       tabBarItemStyle: {
    //         borderRadius: 999,
    //         backgroundColor: "#ffffff",
    //       },
    //       tabBarIcon: ({ color, focused, size }) => (
    //         <Ionicons
    //           name={focused ? "chatbubbles" : "chatbubble-outline"}
    //           size={size}
    //           color={color}
    //         />
    //       ),
    //       tabBarActiveBackgroundColor: "#ffffff",
    //     }}
    //   />
    //   <Tabs.Screen
    //     name="profile"
    //     options={{
    //       title: "Profile",
    //       tabBarItemStyle: {
    //         borderRadius: 999,
    //       },
    //       tabBarIcon: ({ color, focused, size }) => (
    //         <Ionicons
    //           name={focused ? "person" : "person-outline"}
    //           size={size}
    //           color={color}
    //         />
    //       ),
    //       tabBarActiveBackgroundColor: "#ffffff",
    //     }}
    //   />
    // </Tabs>
    <Tabs
      tabBar={props => <TabBar {...props} />}
      screenOptions={{
        headerShown: false
      }}
    >
        <Tabs.Screen 
          name="index"
          options={{
            title: "Chats"
          }}
        />
        <Tabs.Screen 
          name="profile"
          options={{
            title: "Profile"
          }}
        />
        <Tabs.Screen 
          name="updates"
          options={{
            title: "Updates"
          }}
        />
        <Tabs.Screen 
          name="community"
          options={{
            title: "Search"
          }}
        />
    </Tabs>
  );
};

export default TabsLayout;
