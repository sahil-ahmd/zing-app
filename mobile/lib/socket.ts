import { create } from "zustand";
import { io, Socket } from "socket.io-client";
import { QueryClient } from "@tanstack/react-query";
import { Chat, Message, MessageSender } from "@/types";
import * as Sentry from "@sentry/react-native";

const SOCKET_URL = "https://zing-3jsj.onrender.com";

interface SocketState {
  socket: Socket | null;
  isConnected: boolean;
  onlineUsers: Set<string>;
  typingUsers: Map<string, string>; // chatId -> userId
  unreadChats: Set<string>;
  currentChatId: string | null;
  queryClient: QueryClient | null;

  connect: (getToken: () => Promise<string | null>, queryClient: QueryClient) => Promise<void>;
  disconnect: () => void;
  joinChat: (chatId: string) => void;
  leaveChat: (chatId: string) => void;
  sendMessage: (
    chatId: string,
    text: string,
    currentUser: MessageSender,
  ) => void;
  sendTyping: (chatId: string, isTyping: boolean) => void;
}

export const useSocketStore = create<SocketState>((set, get) => ({
  socket: null,
  isConnected: false,
  onlineUsers: new Set(),
  typingUsers: new Map(),
  unreadChats: new Set(),
  currentChatId: null,
  queryClient: null,

  connect: async (getToken: () => Promise<string | null>, queryClient) => {
    const token = await getToken(); // Get fresh token right before connecting
    console.log("Token check:", token?.substring(0, 10) + "...");
    if (!token) return;

    const existingSocket = get().socket;
    // If it's already connecting or connected, don't start a new one
    if (existingSocket?.connected) return;

    // 1. Wake up the Render server if it's sleeping
    try {
        // This simple GET request forces Render to spin up the container
        await fetch(`${SOCKET_URL}/health`, { method: 'GET' });
      } catch (e) {
        console.log("Server is waking up...");
      }

    // Cleanup any dead instances
    if (existingSocket) {
      console.log("Cleaning up old socket before new attempt...");
      existingSocket.removeAllListeners();
      existingSocket.disconnect();
    }

    const socket = io(SOCKET_URL, {
      auth: { token },
      transports: ["polling", "websocket"],
      forceNew: true,
    });

    socket.on("connect", () => {
      console.log("Socket connected, id:", socket.id);
      Sentry.logger.info("Socket connected", { socketId: socket.id });
      set({ isConnected: true });
    });
    socket.on("disconnect", () => {
      console.log("Socket disconnect", socket.id);
      Sentry.logger.info("Socket disconnect", { socketId: socket.id });
      set({ isConnected: false });
    });
    socket.on("online-users", ({ userIds }: { userIds: string[] }) => {
      console.log("Received online-users:", userIds);
      set({ onlineUsers: new Set(userIds) });
    });

    socket.on("user-online", ({ userId }: { userId: string }) => {
      set((state) => ({
        onlineUsers: new Set([...state.onlineUsers, userId]),
      }));
    });

    socket.on("user-offline", ({ userId }: { userId: string }) => {
      set((state) => {
        const onlineUsers = new Set(state.onlineUsers);
        onlineUsers.delete(userId);
        return { onlineUsers: onlineUsers };
      });
    });
    socket.on("socket-error", (error: { message: string }) => {
      console.error("Socket error:", error.message);
      Sentry.logger.error("Socket error occurred", {
        message: error.message,
      });
    });
    socket.on("connect_error", (err: any) => {
      console.error("Handshake failed:", err.message);
      // Check for specialized error info
  console.error("❌ Connection Error Name:", err.name);
  console.error("❌ Connection Error Message:", err.message);
  console.error("❌ Connection Error Description:", err.description); // Important!
  console.error("❌ Connection Error Context:", err.context);
      set({ isConnected: false });
    });
    socket.on("new-message", (message: Message) => {
      const currentQueryClient = get().queryClient; // Get the latest client from state
      if (!currentQueryClient) return;

      const senderId = (message.sender as MessageSender)._id;
      const { currentChatId } = get();

      // add message to the chat's message list, replacing optimistic messages
      queryClient.setQueryData<Message[]>(["messages", message.chat], (old) => {
        if (!old) return [message];
        // remove any optimistic messages (temp IDs) and add the real one
        const filtered = old.filter((m) => !m._id.startsWith("temp-"));
        if (filtered.some((m) => m._id === message._id)) return filtered;
        return [...filtered, message];
      });

      // Update chat's lastMessage directly for instant UI update
      queryClient.setQueryData<Chat[]>(["chats"], (oldChats) => {
        return oldChats?.map((chat) => {
          if (chat._id === message.chat) {
            return {
              ...chat,
              lastMessage: {
                _id: message._id,
                text: message.text,
                sender: senderId,
                createdAt: message.createdAt,
              },
              lastMessageAt: message.createdAt,
            };
          }
          return chat;
        });
      });

      // mark as unread if not currently viewing this chat and message is from other user
      if (currentChatId !== message.chat) {
        const chats = queryClient.getQueryData<Chat[]>(["chats"]);
        const chat = chats?.find((c) => c._id === message.chat);
        if (chat?.participant && senderId === chat.participant._id) {
          set((state) => ({
            unreadChats: new Set([...state.unreadChats, message.chat]),
          }));
        }
      }

      // clear typing indicator when message received
      set((state) => {
        const typingUsers = new Map(state.typingUsers);
        typingUsers.delete(message.chat);
        return { typingUsers: typingUsers };
      });
    });
    socket.on(
      "typing",
      ({
        userId,
        chatId,
        isTyping,
      }: {
        userId: string;
        chatId: string;
        isTyping: boolean;
      }) => {
        set((state) => {
          const typingUsers = new Map(state.typingUsers);
          if (isTyping) typingUsers.set(chatId, userId);
          else typingUsers.delete(chatId);

          return { typingUsers: typingUsers };
        });
      },
    );
    socket.on("reconnect", (attempt) => {
      console.log("Reconnected on attempt:", attempt);
      set({ isConnected: true });

      // Re-join the current chat if the user is inside one
      const { currentChatId } = get();
      if (currentChatId) socket.emit("join-chat", currentChatId);

      // Refetch chats to get missed messages
      queryClient?.invalidateQueries({ queryKey: ["chats"] });
    });

    set({ socket, queryClient });
  },

  disconnect: () => {
    const socket = get().socket;
    if (socket) {
      socket.disconnect();
      set({
        socket: null,
        isConnected: false,
        onlineUsers: new Set(),
        typingUsers: new Map(),
        unreadChats: new Set(),
        currentChatId: null,
        queryClient: null,
      });
    }
  },

  joinChat: (chatId) => {
    const socket = get().socket;
    set((state) => {
      const unreadChats = new Set(state.unreadChats);
      unreadChats.delete(chatId);
      return { currentChatId: chatId, unreadChats: unreadChats };
    });

    if (socket?.connected) {
      socket.emit("join-chat", chatId);
    }
  },

  leaveChat: (chatId) => {
    const { socket } = get();
    set({ currentChatId: null });
    if (socket?.connected) {
      socket.emit("leave-chat", chatId);
    }
  },

  sendMessage: (chatId, text, currentUser) => {
    const { socket, queryClient } = get();
    if (!socket?.connected || !queryClient) return;

    // optimistic updates
    const tempId = `temp-${Date.now()}`;
    const optimisticMessage: Message = {
      _id: tempId,
      chat: chatId,
      sender: currentUser,
      text,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // add optimistic message immediately
    queryClient.setQueryData<Message[]>(["messages", chatId], (old) => {
      if (!old) return [optimisticMessage];
      return [...old, optimisticMessage];
    });

    socket.emit("send-message", { chatId, text });

    Sentry.logger.info("Message sent successfully", {
      chatId,
      messageLength: text.length,
    });

    const errorHandler = (error: { message: string }) => {
      Sentry.logger.error("Failed to send message", {
        chatId,
        error: error.message,
      });
      queryClient.setQueryData<Message[]>(["messages", chatId], (old) => {
        if (!old) return [];
        return old.filter((m) => m._id !== tempId);
      });
      socket.off("socket-error", errorHandler);
    };

    socket.once("socket-error", errorHandler);
  },

  sendTyping: (chatId, isTyping) => {
    const { socket } = get();
    if (socket?.connected) {
      socket.emit("typing", { chatId, isTyping });
    }
  },
}));
