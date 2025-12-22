// backend/config/db.js

const { MongoClient } = require("mongodb");

let db;

const connectDB = async () => {
  try {
    const uri = process.env.MONGODB_URI; // 🔥 FIX HERE

    if (!uri) {
      throw new Error("MONGODB_URI not found in .env");
    }

    const client = new MongoClient(uri);
    await client.connect();

    db = client.db(); // elearnify
    console.log("✅ MongoDB connected");
  } catch (error) {
    console.error("❌ MongoDB connection failed:", error.message);
    process.exit(1);
  }
};

const getDb = () => {
  if (!db) {
    throw new Error("Database not initialized");
  }
  return db;
};

module.exports = {
  connectDB,
  getDb,
};
