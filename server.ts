import mongoose from 'mongoose';
import app from './app.js';
import dotenv from 'dotenv';
import {Server} from 'socket.io';
import { createServer } from 'http';

// import to register the jobs
import './jobs/notificationJob.js';
import './lib/CheckAvailableModels.js';

// Load environment variables
dotenv.config();
const server = createServer(app);
//init socket.io
export const io = new Server(server,{
  cors : {
    origin : process.env.FRONTEND_URL,
    credentials : true,
    methods : ['GET', 'POST'],
  }
})
// listen for connection
io.on("connection", (socket) => {
  console.log("a user connected",  socket.id);

  // join user to room to receive notifications
  //Here, each user joins their own room with their userId. Then you can push notifications directly to them.
socket.on("join", (userId) => {
 socket.join(userId);
 console.log("user joined", userId, socket.id)
})


  socket.on("disconnect", () => {
    console.log("user disconnected", socket.id);
  })
})


  // listModels();
if (!process.env.MONGODB_URI) {
  throw new Error('MONGODB_URI environment variable is not set');
}

if (!process.env.MONGODB_PASSWORD) {
  throw new Error('MONGODB_PASSWORD environment variable is not set');
}

// Connect to MongoDB
const mongoURI = process.env.MONGODB_URI.replace(
  "<db_password>",
  process.env.MONGODB_PASSWORD
);

mongoose
  .connect(mongoURI)
  .then(() => console.log("Connected to MongoDB"))
  .then(() => import('./jobs/notificationJob.js'))
  .catch((err: Error) => console.error("MongoDB connection error:", err));

// Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
