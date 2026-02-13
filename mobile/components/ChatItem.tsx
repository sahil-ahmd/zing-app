import { View, Text, Pressable } from "react-native";
import React from "react";
import { Chat } from "@/types";
import { Image } from "expo-image";
import { formatDistanceToNow } from "date-fns/formatDistanceToNow";

interface ChatItemProps {
  chat: Chat;
  onPress: () => void;
}

const ChatItem = ({ chat, onPress }: ChatItemProps) => {
  const participant = chat.participant;
  const isOnline = true;
  const isTyping = false;
  const hasUnread = false;

  return (
    <Pressable
      className="flex-row items-center py-2 active:opacity-70"
      onPress={onPress}
    >
      <View className="border-2 border-neutral-200 rounded-full p-[0.5px]">
      <View className="relative">
        <Image
          source={{ uri: participant.avatar }}
          style={{
            width: 56,
            height: 56,
            borderRadius: 999,
          }}
        />

        {isOnline && (
          <View className="absolute bottom-0 right-0 size-4 bg-[#C2DFDA] rounded-full border-[3px] border-[#b6eae0]" />
        )}
      </View>
      </View>

      {/** chat info */}
      <View className="flex-1 ml-4">
        <View className="flex-row font-medium justify-between">
          <Text
            className={`text-base font-medium ${hasUnread ? "text-[#a2d3cb]" : "text-black"}`}
          >
            {participant.name}
          </Text>
          <View className="flex-row items-center gap-2">
            {hasUnread && (
              <View className="w-2.5 h-2.5 bg-orange-500 rounded-full" />
            )}
            <Text className="text-xs text-neutral-500">
              {chat.lastMessageAt
                ? formatDistanceToNow(new Date(chat.lastMessageAt), {
                    addSuffix: false,
                  })
                : ""}
            </Text>
          </View>
        </View>

        <View className="flex-row items-center justify-between mt-1">
          {isTyping ? (
            <Text className="text-sm text-orange-500 italic">typing...</Text>
          ) : (
            <Text
              className={`text-sm flex-1 mr-3 ${hasUnread ? "text-neutral-500" : "text-[#a3d4cc]"}`}
              numberOfLines={1}
            >
              {chat.lastMessage?.text || "No messages yet"}
            </Text>
          )}
        </View>
      </View>
    </Pressable>
  );
};

export default ChatItem;
