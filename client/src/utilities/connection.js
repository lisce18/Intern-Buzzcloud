import express from "express";
import { KMSClient, SignCommand } from "@aws-sdk/client-kms";
import { ethers } from "ethers";
import fetch from "node-fetch ";

const app = express();
app.use(express.json());

const kmsClient = new KMSClient({ region: "eu-north-1" });

const biconomyUrl = process.env.BICONOMY_URL;
const biconomyApiKey = process.env.biconomyApiKey;

const kmsKeyId = "arn:aws:kms:eu-north-1:8815221f-8395-4f7f-b9c4-f05abfeb5b37";

app.post("/submit-transaction", async (req, res) => {
    const { drink } = req.body;

    try {
        const trxData={
            to:
        }
    } catch (error) {
        
    }
});
