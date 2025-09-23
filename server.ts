import mongoose from "mongoose";
import app from "./app.js";
import dotenv from "dotenv";
import { Server } from "socket.io";
import { createServer } from "http";

// import to register the jobs
import "./jobs/notificationJob.js";
import "./lib/CheckAvailableModels.js";

// Load environment variables
dotenv.config();
const server = createServer(app);
// Initialize socket.io with CORS configuration
export const io = new Server(server, {
  cors: {
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return callback(null, true);

      const allowedOrigins = process.env.ALLOWED_ORIGINS
        ? process.env.ALLOWED_ORIGINS.split(",").map((o) => o.trim())
        : [
            process.env.FRONTEND_URL,
            "http://localhost:3000",
            "http://localhost:3001",
            "http://127.0.0.1:3000",
            "http://127.0.0.1:3001",
          ].filter(Boolean);

      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        console.error(`Socket.IO CORS error: ${origin} not allowed`);
        callback(new Error("Not allowed by CORS"), false);
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "X-Requested-With",
      "Accept",
    ],
  },
  cookie: {
    name: "io",
    httpOnly: true,
    path: "/",
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 1 week
  },
});
// listen for connection
io.on("connection", (socket) => {
  console.log("a user connected", socket.id);

  // join user to room to receive notifications
  //Here, each user joins their own room with their userId. Then you can push notifications directly to them.
  socket.on("join", (userId) => {
    socket.join(userId);
    console.log("user joined", userId, socket.id);
  });

  socket.on("disconnect", () => {
    console.log("user disconnected", socket.id);
  });
});

// listModels();
if (!process.env.MONGODB_URI) {
  throw new Error("MONGODB_URI environment variable is not set");
}

if (!process.env.MONGODB_PASSWORD) {
  throw new Error("MONGODB_PASSWORD environment variable is not set");
}

// Connect to MongoDB
const mongoURI = process.env.MONGODB_URI.replace(
  "<db_password>",
  process.env.MONGODB_PASSWORD
);

mongoose
  .connect(mongoURI)
  .then(() => console.log("Connected to MongoDB"))
  .then(() => import("./jobs/notificationJob.js"))
  .catch((err: Error) => console.error("MongoDB connection error:", err));

// Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
