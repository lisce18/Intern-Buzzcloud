import React, { useEffect, useState } from "react";
import {
    connectWallet,
    setMessage,
    revealMessage,
} from "../utilities/ContractInteractions";

const Timelock = () => {
    const [walletAddress, setWalletAddress] = useState("");
    const [message, setMessageText] = useState("");
    const [revealedMessages, setRevealedMessages] = useState([]);
    const [status, setStatus] = useState("Connect wallet to display messages.");

    const handleConnectWallet = async () => {
        const walletResponse = await connectWallet();
        setWalletAddress(walletResponse.address);
        setStatus("");
        handleRevealMessages();
    };

    const handleDisconnectWallet = () => {
        setWalletAddress("");
        setStatus("Wallet disconnected.");
        setTimeout(() => {
            setStatus("Connect wallet to display messages.");
        }, 3000);
    };

    const handleSetMessage = async () => {
        if (walletAddress) {
            try {
                const response = await setMessage(message);
                setStatus(response.status);
                await handleRevealMessages();
            } catch (err) {
                setStatus(`Error: ${err.message}`);
            }
        } else {
            setStatus("Please connect your wallet first!");
        }
    };

    const handleRevealMessages = async () => {
        try {
            const response = await revealMessage();
            console.log("Revealed messages response:", response); // Debugging log
            const messages = response.messages || [];
            setRevealedMessages(messages);
            if (messages.length === 0) {
                setStatus("No messages to display!");
            } else {
                setStatus("");
            }
        } catch (err) {
            setStatus(`Error: ${err.message}`);
        }
    };

    useEffect(() => {
        if (walletAddress) {
            handleRevealMessages();
        }
    }, [walletAddress]);

    return (
        <div className="container">
            <div className="header">
                <h1 className="title">
                    <p>Timelock</p>
                    <p>dApp</p>
                </h1>
                {!walletAddress && (
                    <button
                        className="walletBtn"
                        onClick={handleConnectWallet}
                    >
                        Connect Wallet
                    </button>
                )}

                {walletAddress && walletAddress.length > 0 && (
                    <>
                        <div className="block">
                            <p className="walletAddress">
                                Connected:{" "}
                                {`${walletAddress.substring(
                                    0,
                                    6
                                )}...${walletAddress.substring(
                                    walletAddress.length - 6
                                )}`}
                            </p>
                            <button
                                className="disconnectWalletBtn"
                                onClick={handleDisconnectWallet}
                            >
                                Disconnect wallet
                            </button>
                        </div>
                    </>
                )}
            </div>
            {walletAddress && (
                <div className="addMessage">
                    <input
                        type="text"
                        value={message}
                        onChange={(e) => setMessageText(e.target.value)}
                        placeholder="Enter your message here!"
                    />
                    <button
                        className="addMsgBtn"
                        onClick={handleSetMessage}
                    >
                        Set Message
                    </button>
                </div>
            )}
            <div className="messages">
                <h2>Messages</h2>
                <ul>
                    {walletAddress && revealedMessages.length > 0 ? (
                        revealedMessages.map((msg, index) => (
                            <li
                                className="message"
                                key={index}
                            >
                                {msg.text}
                                {msg.unlockTime >
                                    Math.floor(Date.now() / 1000) && (
                                    <span> </span>
                                )}
                            </li>
                        ))
                    ) : (
                        <></>
                    )}
                </ul>
            </div>
            <p className="status">{status}</p>
        </div>
    );
};

export default Timelock;
