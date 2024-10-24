import express from "express";
import { signTxWithKMS } from "./utils/kmsHelper.js";
import { relayTxToBiconomy } from "./utils/biconomyHelper.js";
import { storeInputDB } from "./utils/dynamoHelper.js";

const app = express();
app.use(express.json());

app.post("/submit-favorite-drink", async (req, res) => {
    const { drink } = req.body;

    try {
        const signedTx = await signTxWithKMS(drink);
        const txHash = await relayTxToBiconomy(signedTx);

        await storeInputDB("user123", drink);
        res.json({ txHash });
    } catch (err) {
        console.error(err);
        res.status(500).json({ err: "Failed to submit favorite drink. " });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port: ${PORT}`));
