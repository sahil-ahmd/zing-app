import { createServer } from "http";
import app from "./src/app.js";
import { connectDB } from "./src/config/database.js";
import { initializeSocket } from "./src/utils/socket.js";

const PORT = process.env.PORT || 3000;

// 1. Create the server wrapping the app
const httpServer = createServer(app);

// 2. Attach Socket.io to THIS specific httpServer
initializeSocket(httpServer);

connectDB()
  .then(() => {
    // 3. IMPORTANT: Change app.listen to httpServer.listen
    httpServer.listen(PORT, () => {
      console.log(`✅ Server and Socket.io running on PORT: ${PORT}`);
    });
  })
  .catch((error) => {
    console.log("❌ Failed to start server: ", error);
    process.exit(1);
  });
