import { View, Text, Pressable } from "react-native";
import React from "react";
import { Ionicons } from "@expo/vector-icons";
import { useRouter, Href } from "expo-router";

interface HeaderProps {
  title: string;
  iconName?: React.ComponentProps<typeof Ionicons>["name"];
  route: Href;
}

const Header = ({ title, iconName, route }: HeaderProps) => {
  const router = useRouter();

  return (
    <View className="flex-row items-center justify-between pb-4 mt-8 bg-white">
      {title && <Text className="text-3xl font-bold text-black">{title}</Text>}
      <Pressable
        className=""
        onPress={() => router.push(route)}
      >
        <View className="bg-black p-1 rounded-lg">
          {iconName && <Ionicons name={iconName} size={24} color={"#FFFFFF"} />}
        </View>
      </Pressable>
    </View>
  );
};

export default Header;
