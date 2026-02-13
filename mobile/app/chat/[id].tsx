import { View, Text, ScrollView, Pressable } from "react-native";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { router, useLocalSearchParams } from "expo-router";
import { useCurrentUser } from "@/hooks/useAuth";
import { useMessages } from "@/hooks/useMessage";
import { useSocketStore } from "@/lib/socket";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";

type ChatParams = {
  id: string;
  participantId: string;
  name: string;
  avatar: string;
};

const ChatDetailScreen = () => {
  const { id: chatId, avatar, name, participantId } = useLocalSearchParams<ChatParams>();

  const [messageText, setMessageText] = useState("");
  const [isSending, setIsSending] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);

  const { data: currentUser } = useCurrentUser();
  const { data: messages, isLoading } = useMessages(chatId);

  const {
    joinChat,
    leaveChat,
    sendMessage,
    sendTyping,
    isConnected,
    onlineUsers,
    typingUsers,
  } = useSocketStore();

  const isOnline = participantId ? onlineUsers.has(participantId) : false;
  const isTyping = typingUsers.get(chatId) === participantId;

  const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // join chat room on mount, leave on unmount
  useEffect(() => {
    if (chatId && isConnected) joinChat(chatId);

    return () => {
      if (chatId) leaveChat(chatId);
    };
  }, [chatId, isConnected, joinChat, leaveChat]);

  // scroll to bottom when new messages arrive
  useEffect(() => {
    if (messages && messages.length > 0) {
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [messages]);

  const handleTyping = useCallback(
    (text: string) => {
      setMessageText(text);

      if (!isConnected || !chatId) return;

      // send typing start
      if (text.length > 0) {
        sendTyping(chatId, true);

        // clear existing timeout
        if (typingTimeoutRef.current) {
          clearTimeout(typingTimeoutRef.current);
        }

        // stop typing after 2 seconds of no input
        typingTimeoutRef.current = setTimeout(() => {
          sendTyping(chatId, false);
        }, 2000);
      } else {
        // text cleared, stop typing
        if (typingTimeoutRef.current) {
          clearTimeout(typingTimeoutRef.current);
        }
        sendTyping(chatId, false);
      }
    },
    [chatId, isConnected, sendTyping],
  );

  const handleSend = () => {
    console.log({ isSending, isConnected, currentUser, messageText });
    if (!messageText.trim() || isSending || !isConnected || !currentUser)
      return;

    // stop typing indicator
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    sendTyping(chatId, false);

    setIsSending(true);
    sendMessage(chatId, messageText.trim(), {
      _id: currentUser._id,
      name: currentUser.name,
      email: currentUser.email,
      avatar: currentUser.avatar,
    });
    setMessageText("");
    setIsSending(false);

    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);
  };

  return (
    <SafeAreaView className="flex-1" edges={["top", "bottom"]}>
      {/* Header */}
      <View className="flex-row items-center px-4 py-3 border-b border-neutral-200">
        <Pressable onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={20} color="#000000" />
        </Pressable>
        <View className="flex-row items-center flex-1 ml-3">
          {avatar && <Image source={avatar} style={{ width: 40, height: 40, borderRadius: 999 }} />}
          <View className="ml-3">
            <Text className="text-black font-semibold text-lg" numberOfLines={1}>
              {name}
            </Text>
            <Text className={`text-xs ${!isTyping ? "text-[#2c8c7c]" : "text-neutral-500"}`}>
              {isTyping ? "typing..." : isOnline ? "Online" : "Offline"}
            </Text>
          </View>
        </View>
        <View className="flex-row items-center gap-3">
          <Pressable className="w-10 h-10 rounded-full items-center justify-center bg-[#C2DFDA]">
            <Ionicons name="call" size={18} color="#000000" />
          </Pressable>
          <Pressable className="w-10 h-10 rounded-full items-center justify-center bg-[#C2DFDA]">
            <Ionicons name="videocam" size={18} color="#000000" />
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default ChatDetailScreen;
