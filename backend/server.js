const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const path = require("path");
const connectDatabase = require("./config/db");
const ticketingRoutes = require("./routes/ticketingRoutes");
const authRoutes = require("./routes/authRoutes");

dotenv.config({ path: path.join(__dirname, ".env") });
connectDatabase();

const app = express();

app.use(
  cors({
    origin: ["http://localhost:6500"],
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    credentials: false
  })
);
app.use(express.json());

app.get("/", (_req, res) => {
  res.json({
    success: true,
    message: "Ticket booking API is running."
  });
});

app.use("/api/ticketing", ticketingRoutes);
app.use("/api/auth", authRoutes);

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.originalUrl}`
  });
});

app.use((error, _req, res, _next) => {
  if (error.name === "ValidationError") {
    return res.status(400).json({
      success: false,
      message: error.message
    });
  }

  if (error.name === "CastError") {
    return res.status(400).json({
      success: false,
      message: "Invalid MongoDB ObjectId."
    });
  }

  console.error("Unhandled server error:", error);
  return res.status(500).json({
    success: false,
    message: "Internal server error."
  });
});

const PORT = process.env.PORT || 7500;
app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});
