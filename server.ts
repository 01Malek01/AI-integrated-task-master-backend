import mongoose from 'mongoose';
import app from './app.js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

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
  .catch((err: Error) => console.error("MongoDB connection error:", err));

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
