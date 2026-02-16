import { Socket, Server as SocketServer } from "socket.io";
import { Server as HttpServer } from "http";
import { verifyToken } from "@clerk/express";
import { Message } from "../models/Message.js";
import { Chat } from "../models/Chat.js";
import { User } from "../models/User.js";

// Store online users in memory: <userId, socketId>
export const onlineUsers: Map<string, string> = new Map();

export const initializeSocket = (httpServer: HttpServer) => {
  const allowedOrigins = [
    "http://localhost:8081", // Expo mobile
    "http://localhost:5173", // Vite web
    process.env.FRONTEND_URL, // production
  ].filter(Boolean) as string[];

  const io = new SocketServer(httpServer, {
    cors: {
      origin: "*", // During debugging, use "*" to rule out CORS as the cause
      methods: ["GET", "POST"],
      credentials: true
    },
    allowEIO3: true,
    transports: ["polling", "websocket"], // Allow fallback
  });

  // Add a listener to see if the connection is even HITTING the server
  io.engine.on("connection_error", (err) => {
    console.log("Server-side Connection Error:", err.req);      // error request object
    console.log("Error Code:", err.code);     // the error code, for example 1
    console.log("Error Message:", err.message);  // the error message, for example "Session ID unknown"
    console.log("Error Context:", err.context);  // some additional error context
  });

  // Verify socket connection - if the user is authenticated, we will store the use id in the socket
  io.use(async (socket, next) => {
    const token = socket.handshake.auth.token; // this is what user will send from client

    if (!token) {
      console.error("❌ Socket Auth: No token provided");
      return next(new Error("Authentication error: No token"));
    }

    try {
      const session = await verifyToken(token, {
        secretKey: process.env.CLERK_SECRET_KEY!,
        // Add leeway to account for Render server clock drift
        clockSkewInMs: 30000,
      });

      // 2. Map Clerk ID to your MongoDB User
      const user = await User.findOne({ clerkId: session.sub });

      if (!user) {
        console.error(
          `❌ Socket Auth: Clerk user ${session.sub} not found in DB`,
        );
        return next(new Error("User not found"));
      }

      socket.data.userId = user._id.toString();
      console.log(`✅ Socket Auth: User ${user.name} connected`);
      next();
    } catch (error: any) {
      console.error("Socket Auth Exception:", error.message);
      // Don't just pass the error object, pass a string code
      next(new Error("auth_failed"));
    }
  });

  // this "connection" event name is special and should be written like this
  // it's the event that is triggered when a new client connects to the server
  io.on("connection", (socket) => {
    const userId = socket.data.userId;

    // store user in the onlineUsers map
    onlineUsers.set(userId, socket.id);
    
    // send list of currently online users to the newly connected client
    socket.emit("online-users", { userId: Array.from(onlineUsers.keys()) });


    // notify others that this current user is online
    socket.broadcast.emit("user-online", { userId });

    socket.join(`user:${userId}`);

    socket.on("join-chat", (chatId: string) => {
      socket.join(`chat:${chatId}`);
    });

    socket.on("leave-chat", (chatId: string) => {
      socket.leave(`chat:${chatId}`);
    });

    // handle sending messages
    socket.on(
      "send-message",
      async (data: { chatId: string; text: string }) => {
        try {
          const { chatId, text } = data;

          const chat = await Chat.findOne({
            _id: chatId,
            participants: userId,
          });

          if (!chat) {
            socket.emit("socket-error", { message: "Chat not found" });
            return;
          }

          const message = await Message.create({
            chat: chatId,
            sender: userId,
            text,
          });

          chat.lastMessage = message._id;
          chat.lastMessageAt = new Date();
          await chat.save();

          await message.populate("sender", "name avatar");

          // emit to chat room (for users inside the chat)
          io.to(`chat:${chatId}`).emit("new-message", message);

          // also emit to participants' personal rooms (for chat list view)
          for (const participantId of chat.participants) {
            io.to(`user:${participantId}`).emit("new-message", message);
          }
        } catch (error) {
          socket.emit("socket-error", { message: "Failed to send message" });
        }
      },
    );

    // user is typing event
    socket.on("typing", async (data: { chatId: string; isTyping: boolean }) => {
      const typingPayload = {
        userId,
        chatId: data.chatId,
        isTyping: data.isTyping,
      };

      // emit to chat room (for users inside the chat)
      socket.to(`chat:${data.chatId}`).emit("typing", typingPayload);

      // also emit to other participants's personal room (for chat list view)
      try {
        const chat = await Chat.findById(data.chatId);
        if (chat) {
          const otherParticipants = chat.participants.find(
            (p: any) => p.toString() !== userId,
          );
          if (otherParticipants) {
            socket
              .to(`user:${otherParticipants}`)
              .emit("typing", typingPayload);
          }
        }
      } catch (error) {}
    });

    // disconnect (logout)
    socket.on("disconnect", () => {
      onlineUsers.delete(userId);

      // notify others that this user is offline
      socket.broadcast.emit("user-offline", { userId });
    });
  });
  return io;
};
