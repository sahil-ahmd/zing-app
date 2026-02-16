# 💬 Zing – Real-Time Chat Application
Zing is a full-stack real-time chat application built with modern technologies. It supports live messaging, typing indicators, online presence tracking, authentication, and multi-platform clients (mobile + web).

## 🚀 Features
### 🔐 Authentication

- Secure authentication using Clerk
- JWT-based token verification on backend
- Protected socket connections
- Automatic user sync with database

### 💬 Real-Time Messaging

- Real-time chat powered by Socket.IO
- Instant message delivery
- Chat room system (chat:{chatId})
- Personal user rooms (user:{userId})
- Message broadcasting to participants
- Live message updates in chat list

### 🟢 Online Presence System

- In-memory online users tracking using Map<string, string>
- Real-time online/offline events
- Green dot presence indicator
- Automatic disconnect handling
- Full online user list sync

### ✍️ Typing Indicators

- Real-time typing events
- Typing visibility inside chat
- Typing sync in chat list preview

### 👥 Chat Management

- Get or create chat dynamically
- Prevent duplicate chats
- Last message tracking
- Last message timestamp
- Participant-based access control

### 🔎 User Search

- Client-side user search
- Filter by name or email
- Instant search results
- Clean modal-based new chat UI

### 📱 Cross Platform

- Mobile app built with Expo
- Navigation via Expo Router
- Web support via Vite
- Responsive UI design


| 💻 Frontend      | 🖥 Backend |
| ---------------- | ---------- |
| React            | Node.js    |
| React Native     | Express    |
| Expo             | Socket.IO  |
| Zustand          | MongoDB    |
| TanStack Query   | Mongoose   |
| Socket.IO Client | Clerk      |


## 🧠 Architecture Overview
### 🔹 Real-Time Flow

- User logs in via Clerk
- Token is sent during socket handshake
- Backend verifies token
- User joins:
  - Personal room (user:{id})
  - Chat rooms (chat:{chatId})
- Messages are:
  - Stored in MongoDB
- Emitted to chat room
- Emitted to user rooms

## 🔹 Online System

- On connection:
  - User ID added to onlineUsers Map
  - Full online list broadcasted
- On disconnect:
  - User removed from Map
  - Updated list broadcasted

### 📸 UI Highlights

- Clean modern interface
- Online green dot indicator
- Smooth modal transitions
- Scroll-optimized chat view
- Typing status animation

### ScreenShots

<img width="626" height="1382" alt="Screenshot 2026-02-16 230857" src="https://github.com/user-attachments/assets/950ba139-50fd-44dd-83b8-435da95dc43c" />
<img width="619" height="1381" alt="Screenshot 2026-02-16 230818" src="https://github.com/user-attachments/assets/ca27c3c3-37e1-4105-9d94-7fafc37aff3f" />
<img width="626" height="1381" alt="Screenshot 2026-02-16 230950" src="https://github.com/user-attachments/assets/d65b3d84-0408-4015-8956-e80017dcad77" />
<img width="626" height="1381" alt="Screenshot 2026-02-16 230950" src="https://github.com/user-attachments/assets/d65b3d84-0408-4015-8956-e80017dcad77" />
<img width="632" height="1355" alt="Screenshot 2026-02-16 231030" src="https://github.com/user-attachments/assets/481cc6a9-91ae-4604-817e-9cbd7bf8f976" />
<img width="627" height="1343" alt="Screenshot 2026-02-16 231101" src="https://github.com/user-attachments/assets/08310fa1-efc2-4522-9354-7e81569130fe" />
<img width="634" height="1380" alt="Screenshot 2026-02-16 230915" src="https://github.com/user-attachments/assets/c6676ef8-8dee-4ef3-8d02-0797b04480af" />


## 🏁 Conclusion

Zing is a scalable real-time messaging application built with modern full-stack technologies. It demonstrates:
- Real-time system design
- Authentication integration
- State management
- Cross-platform development
- Backend + socket architecture
