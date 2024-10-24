import express from "express";
import { storeInputDB } from "../utils/dynamoHelper.js";

const router = express.Router();

router.post("/submit-favorite-drink", async (req, res) => {
    const { userId, drink } = req.body;

    try {
        await storeInputDB(userId, drink);
        res.json({ message: "Favorite drink submitted successfully!" });
    } catch (error) {
        res.status(500)({ error: "Failed to submit favorite drink." });
    }
});

export default router;
