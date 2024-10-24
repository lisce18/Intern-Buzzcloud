import fetch from "node-fetch";
import { config } from "../config/env.js";

export const relayTxToBiconomy = async (signedTx) => {
    const response = await fetch(config.biconomyUrl, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "x-api-key": config.biconimyApiKey,
        },
        body: JSON.stringify({ rawTx: signedTx }),
    });

    const { txHash } = await response.json();
    return txHash;
};
