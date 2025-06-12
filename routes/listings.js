import express from "express";
import { MongoClient } from "mongodb";
import dotenv from "dotenv";

dotenv.config(); // Read url from .env file


const router = express.Router();
const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);

// GET all listings (up to 20 results)
router.get("/", async (req, res) => {
  try {
    await client.connect();
    const collection = client
      .db("sample_airbnb")
      .collection("listingsAndReviews");

    // Get filter options from URL query
    const { location, propertyType, bedrooms } = req.query;

    // Set up a search filter based on query
    const query = {};
    if (location) query["address.market"] = location;
    if (propertyType) query["property_type"] = propertyType;
    if (bedrooms) query["bedrooms"] = parseInt(bedrooms);

    // Set up a search filter for bedrooms more than or equal to 8
    if (req.query.bedrooms) {
      if (req.query.bedrooms === "8+") {
        query["bedrooms"] = { $gte: 8 };
      } else {
        query["bedrooms"] = parseInt(req.query.bedrooms);
      }
    }

    let listings;

    if (Object.keys(query).length === 0) {
      // Initial display: random 20 property listings.
      listings = await collection
        .aggregate([
          { $sample: { size: 20 } },
          {
            $project: {
              name: 1,
              summary: 1,
              price: 1,
              review_scores: 1,
              address: 1,
            },
          },
        ])
        .toArray();
    } else {
      // With filters: search based on user input
      listings = await collection
        .find(query)
        .project({
          name: 1,
          summary: 1,
          price: 1,
          review_scores: 1,
          address: 1,
        })
        .toArray();
    }

    // Convert price from Decimal128 to string and extract rating
    const processed = listings.map((item) => ({
      ...item,
      price: item.price?.toString?.(),
      rating: item.review_scores?.review_scores_rating ?? null,
    }));

    // Return processed data to frontend
    res.json(processed);
  } catch (err) {
    console.error("Error fetching listings:", err.message);
    res.status(500).json({ error: "Failed to fetch listings" });
  }
});

export default router;
