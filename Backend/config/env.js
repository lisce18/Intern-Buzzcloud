import dotenv from "dotenv";

dotenv.config();

export const config = {
    kmsKeyId: process.env.KMS_KEY_ID,
    biconomyUrl: process.env.BICONOMY_URL,
    biconimyApiKey: process.env.BICONOMY_API_KEY,
    awsRegion: process.env.AWS_REGION,
};
