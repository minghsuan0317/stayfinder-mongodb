import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import listingsRoutes from "./routes/listings.js";
import bookingsRoutes from "./routes/bookings.js";

// Read url from .env file
dotenv.config();

const app = express();
const port = process.env.PORT || 4000;

// Get current file path
const __filename = fileURLToPath(import.meta.url);

// Get the folder path of current file
const __dirname = path.dirname(__filename);

// === Middleware settings ===
// Allow requests from other websites
app.use(cors());
// Let the server handle JSON data sent from the frontend
app.use(express.json());
// Serve static files from the "public" folder
app.use(express.static(path.join(__dirname, "public")));

// === API Routes ===
app.use("/api/listings", listingsRoutes);
app.use("/api/bookings", bookingsRoutes);

// === Start the server ===
app.listen(port, () => {
  console.log(`🚀 Server is running on http://localhost:${port}`);
});
