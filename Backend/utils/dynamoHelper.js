import { DynamoDBClient, PutItemCommand } from "@aws-sdk/client-dynamodb";
import { config } from "../config/env.js";

const dynamoDbClient = new DynamoDBClient({ region: config.awsRegion });

export const storeInputDB = async (userId, drink) => {
    const params = {
        TableName: "FavoriteDrinks",
        Item: {
            userId: { S: userId },
            drink: { S: drink },
            timestamp: { S: new Date().toISOString() },
        },
    };

    try {
        const putCommand = new PutItemCommand(params);
        await dynamoDbClient.send(putCommand);
        console.log("Item successfully added to DynamoDB");
    } catch (err) {
        console.error("Error inserting item: ", err);
        throw new Error("Failed to store item in DynamoDB");
    }
};
