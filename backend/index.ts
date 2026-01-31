import app from "./src/app.js";
import { connectDB } from "./src/config/database.js";

const PORT = process.env.PORT || 3000;

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
