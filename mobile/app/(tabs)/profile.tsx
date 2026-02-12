import { useAuth, useUser } from "@clerk/clerk-expo";
import { View, Text, Pressable, ScrollView } from "react-native";
import { Image } from "expo-image";
import { Ionicons } from "@expo/vector-icons";

const MENU_SECTIONS = [
  {
    title: "Account",
    items: [
      { icon: "person-outline", label: "Edit Profile", color: "#F4A261" },
      {
        icon: "shield-checkmark-outline",
        label: "Privacy & Security",
        color: "#10B981",
      },
      {
        icon: "notifications-outline",
        label: "Notifications",
        value: "On",
        color: "#8B5CF6",
      },
    ],
  },
  {
    title: "Preferences",
    items: [
      {
        icon: "moon-outline",
        label: "Dark Mode",
        value: "On",
        color: "#6366F1",
      },
      {
        icon: "language-outline",
        label: "Language",
        value: "English",
        color: "#EC4899",
      },
      {
        icon: "cloud-outline",
        label: "Data & Storage",
        value: "1.2 GB",
        color: "#14B8A6",
      },
    ],
  },
  {
    title: "Support",
    items: [
      { icon: "help-circle-outline", label: "Help Center", color: "#F59E0B" },
      { icon: "chatbubble-outline", label: "Contact Us", color: "#3B82F6" },
      { icon: "star-outline", label: "Rate the App", color: "#F4A261" },
    ],
  },
];

const ProfileTab = () => {
  const { signOut } = useAuth();
  const { user } = useUser();

  return (
    <ScrollView
      className="bg-white"
      contentInsetAdjustmentBehavior="automatic"
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingBottom: 40 }}
    >
      {/** Header */}
      <View className="items-center mt-20">
        <View className="relative">
          <View className="rounded-full border-2 border-neutral-200 p-1">
            <Image
              source={user?.imageUrl}
              style={{
                width: 100,
                height: 100,
                borderRadius: 999,
              }}
            />
          </View>
          <Pressable className="absolute bottom-1 right-1 w-8 h-8 bg-[#C2DFDA] rounded-full items-center justify-center border-2 border-[#9ce0d4]">
            <Ionicons name="camera" size={16} color="#0D0D0F" />
          </Pressable>
        </View>

         {/* NAME & EMAIL */}
         <Text className="text-2xl font-bold text-black mt-4">
            {user?.firstName} {user?.lastName}
          </Text>

          <Text className="text-muted-foreground mt-1">
            {user?.emailAddresses[0]?.emailAddress}
          </Text>

          <View className="flex-row items-center mt-3 bg-[#333] px-3 py-1.5 rounded-full">
            <View className="w-2 h-2 bg-white rounded-full mr-2" />
            <Text className="text-white text-sm font-medium">Online</Text>
          </View>
      </View>

      {/** Menu-section */}
      {MENU_SECTIONS.map((section) => (
        <View key={section.title} className="mt-6 mx-5">
          <Text className="text-black text-xs font-semibold uppercase tracking-wider mb-2 ml-1">
            {section.title}
          </Text>
          <View className="rounded-2xl overflow-hidden">
            {section.items.map((item, index) => (
              <Pressable
                key={item.label}
                className={`flex-row items-center px-4 py-3 ${
                  index < section.items.length - 1 ? "border-b border-neutral-100" : ""
                }`}
              >
                <View
                  className="w-9 h-9 rounded-xl items-center justify-center"
                  style={{ backgroundColor: "#C2DFDA" }}
                >
                  <Ionicons name={item.icon as any} size={16} color={"#000000"} />
                </View>
                <Text className="flex-1 ml-3 text-black font-medium">{item.label}</Text>
                {item.value && (
                  <Text className="text-neutral-500 text-sm mr-1">{item.value}</Text>
                )}
                <Ionicons name="chevron-forward" size={18} color="#6B6B70" />
              </Pressable>
            ))}
          </View>
        </View>
      ))}

      {/* Logout Button */}
      <Pressable
        className="mx-5 mt-8 bg-black rounded-full py-4 items-center"
        onPress={() => signOut()}
      >
        <View className="flex-row items-center">
          <Ionicons name="log-out-outline" size={20} color="#FFFFFF" />
          <Text className="ml-2 text-white font-semibold">Log Out</Text>
        </View>
      </Pressable>
    </ScrollView>
  );
};

export default ProfileTab;
