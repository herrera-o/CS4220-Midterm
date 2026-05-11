import express from "express";
import { getDB } from "../services/db.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const { type } = req.query;

    if (!type) {
      return res.status(400).json({
        error: "type query parameter is required",
      });
    }

    if (type !== "keywords") {
      return res.status(400).json({
        error: "type must be keywords",
      });
    }

    const db = getDB();

    const collection = db.collection("SearchHistoryKeyword");

    const keywords = await collection
      .find({}, { projection: { _id: 0 } })
      .toArray();

    res.json(keywords);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Internal server error",
    });
  }
});

export default router;