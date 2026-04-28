import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import mongoose from "mongoose";
import itemRoutes from "./routes/itemRoutes.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "Item Manager API is running..." });
});

app.use("/api/items", itemRoutes);

const PORT = process.env.PORT || 5000;

// Add connection options with timeout
const mongooseOptions = {
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 5000,
  connectTimeoutMS: 5000,
};

mongoose
  .connect(process.env.MONGO_URI, mongooseOptions)
  .then(() => {
    console.log("✓ MongoDB connected successfully");
    app.listen(PORT, () => {
      console.log(`✓ Server running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("✗ Database connection error:", error.message);
    console.log("⚠ Starting server in offline mode (API without database)...");
    app.listen(PORT, () => {
      console.log(`✓ Server running on port ${PORT} (Database not connected)`);
      console.log("⚠ To fix: Whitelist your IP in MongoDB Atlas https://www.mongodb.com/docs/atlas/security-whitelist/");
    });
  });