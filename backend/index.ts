import { createServer } from "http";
import app from "./src/app.js";
import { connectDB } from "./src/config/database.js";
import { initializeSocket } from "./src/utils/socket.js";

const PORT = process.env.PORT || 3000;

// Socket Connection
const httpServer = createServer(app);
initializeSocket(httpServer);

connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log("Server is running on PORT: ", PORT);
    });
  })
  .catch((error) => {
    console.log("Failed to start server: ", error);
    process.exit(1);
  });
