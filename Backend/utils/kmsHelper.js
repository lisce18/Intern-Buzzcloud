import { KMSClient, SignCommand } from "@aws-sdk/client-kms";
import { ethers } from "ethers";
import { config } from "../config/env.js";

const kmsClient = new KMSClient({ region: config.awsRegion });

export const signTxWithKMS = async (drink) => {
    const txData = {
        to: "0x7a1ea75d5dc98f0857610ed503fb3cd2c14af677",
        gasLimit: 100000,
        data: ethers.utils.defaultAbiCoder.encode(["string"], [drink]),
    };

    const unsignedTx = ethers.utils.serializeTransaction(txData);
    const txHash = ethers.utils.keccak256(unsignedTx);

    const signCommand = new SignCommand({
        KeyId: config.kmsKeyId,
        Message: txHash,
        MessageType: "DIGEST",
        SigningAlgorithm: "ECSDA_SHA_256",
    });

    const { Signature } = await kmsClient.send(signCommand);
    const { r, s, v } = ethers.utils.splitSignature(Signature);

    return ethers.utils.serializeTransaction(txData, { v, r, s });
};
