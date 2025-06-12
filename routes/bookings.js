import express from "express";
import { MongoClient } from "mongodb";
import dotenv from "dotenv";


dotenv.config(); // Read url from .env file

const router = express.Router();
const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);

// POST endpoint to create a new booking
router.post("/", async (req, res) => {
  try {
    await client.connect();
    const db = client.db("sample_airbnb");
    const bookings = db.collection("bookings");

    // Get booking data from request body
    const {
      listingId,
      startDate,
      endDate,
      clientName,
      email,
      daytimePhone,
      mobile,
      postalAddress,
      homeAddress,
    } = req.body;

    // Check required fields
    if (!listingId || !startDate || !endDate || !clientName || !email) {
      return res.status(400).json({ error: "Missing required fields." });
    }

    // Create booking object for MongoDB
    const newBooking = {
      listingId, // Reference to listingsAndReviews
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      clientName,
      email,
      daytimePhone: daytimePhone || "",
      mobile: mobile || "",
      postalAddress: postalAddress || "",
      homeAddress: homeAddress || "",
      createdAt: new Date(), // Save the creation time
    };

    // Insert booking into the collection
    const result = await bookings.insertOne(newBooking);

    res.status(201).json({
      message: "Booking created",
      bookingID: result.insertedId,
    });
  } catch (err) {
    console.error("Error creating booking:", err.message);
    res.status(500).json({ error: "Failed to create booking" });
  }
});

export default router;
