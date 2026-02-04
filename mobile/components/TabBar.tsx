import { View, Text } from "react-native";
import React from "react";
import type { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { PlatformPressable } from "@react-navigation/elements";
import { useLinkBuilder } from "@react-navigation/native";
import Ionicons from "@expo/vector-icons/Ionicons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

type TabRouteName = "index" | "profile" | "updates" | "community";

const TabBar = ({ state, descriptors, navigation }: BottomTabBarProps) => {
  const { buildHref } = useLinkBuilder();

  const icons = {
    index: (props: any) => (
      <Ionicons name="chatbox-outline" size={20} {...props} />
    ),
    profile: (props: any) => (
      <Ionicons name="person-outline" size={20} {...props} />
    ),
    updates: (props: any) => (
      <MaterialIcons name="update" size={20} {...props} />
    ),
    community: (props: any) => (
      <Ionicons name="search-outline" size={20} {...props} />
    ),
  };

  return (
    <View
      className="flex flex-row items-center justify-between bg-white py-4"
      style={{
        borderTopWidth: 2,
        borderTopColor: "#f2f2f2"
      }}
    >
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];

        if (["_sitemap", "+not-found"].includes(route.name)) return null;

        const label =
          typeof options.tabBarLabel === "string"
            ? options.tabBarLabel
            : typeof options.title === "string"
              ? options.title
              : route.name;

        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: "tabPress",
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name, route.params);
          }
        };

        const onLongPress = () => {
          navigation.emit({
            type: "tabLongPress",
            target: route.key,
          });
        };

        const routeName = route.name as TabRouteName;
        const Icon = icons[routeName];

        if (!Icon) return null; // ✅ prevents runtime crash

        return (
          <PlatformPressable
            key={route.key}
            href={buildHref(route.name, route.params)}
            accessibilityState={isFocused ? { selected: true } : {}}
            accessibilityLabel={options.tabBarAccessibilityLabel}
            testID={options.tabBarButtonTestID}
            onPress={onPress}
            onLongPress={onLongPress}
            className="flex-1 items-center justify-center"
          >
            <View
              style={{
                width: 55,
                height: 32,
                alignItems: "center",
                justifyContent: "center",
                borderRadius: 22,
                backgroundColor: isFocused ? "#F2F2F2" : "transparent",
                overflow: "hidden",
              }}
            >
              <Icon color={isFocused ? "black" : "#969696"} />
            </View>

            <Text
              style={{
                color: isFocused ? "black" : "#969696",
                fontSize: 14,
                marginTop: 2,
                fontWeight: isFocused ? "600" : "400",
              }}
            >
              {label}
            </Text>
          </PlatformPressable>
        );
      })}
    </View>
  );
};

export default TabBar;
