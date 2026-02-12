import ChatItem from "@/components/ChatItem";
import EmptyUI from "@/components/EmptyUI";
import Header from "@/components/Header";
import { useChat } from "@/hooks/useChat";
import { Chat } from "@/types";
import { useRouter } from "expo-router";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  Text,
  View,
} from "react-native";

const ChatsTab = () => {
  const router = useRouter();
  const { data: chats, isLoading, error, refetch } = useChat();

  if (isLoading) {
    return (
      <View className="flex-1 bg-white items-center justify-center">
        <ActivityIndicator size={"large"} color={"#333"} />
      </View>
    );
  }

  if (error) {
    return (
      <View className="flex-1 bg-white items-center justify-center">
        <Text className="text-rose-500">Failed to load chats</Text>
        <Pressable
          onPress={() => refetch()}
          className="mt-4 px-4 py-2 bg-[#111] rounded-lg"
        >
          <Text className="text-black">Retry</Text>
        </Pressable>
      </View>
    );
  }

  const handleChatPress = (chat: Chat) => {
    router.push({
      pathname: "/chat/[id]",
      params: {
        id: chat._id,
        participantId: chat.participant._id,
        name: chat.participant.name,
        avatar: chat.participant.avatar,
      },
    });
  };

  return (
    <View className="flex-1 bg-white">
      <FlatList
        data={chats}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <ChatItem chat={item} onPress={() => handleChatPress(item)} />
        )}
        showsVerticalScrollIndicator={false}
        contentInsetAdjustmentBehavior="automatic"
        contentContainerStyle={{
          paddingHorizontal: 20,
          paddingTop: 16,
          paddingBottom: 24,
        }}
        ListHeaderComponent={
          <Header title="Chats" iconName="add-outline" route="/new-chat" />
        }
        ListEmptyComponent={
          <EmptyUI
            title="No chats yet"
            subtitle="Start a new conversation"
            iconName="chatbubble-outline"
            iconColor="#C2DFDA"
            buttonLabel="New Chat"
            onPressButton={() => router.push("/new-chat")}
          />
        }
      />
    </View>
  );
};

export default ChatsTab;
