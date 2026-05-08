const mongoose = require("mongoose");

const connectDatabase = async () => {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error("MONGO_URI is missing in backend/.env");
    }
    await mongoose.connect(process.env.MONGO_URI);
    // Keep this log to quickly confirm DB connectivity in local runs.
    console.log("MongoDB connected successfully.");
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
    process.exit(1);
  }
};

module.exports = connectDatabase;
