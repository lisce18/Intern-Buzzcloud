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
    const [status, setStatus] = useState("");

    const handleConnectWallet = async () => {
        const walletResponse = await connectWallet();
        setWalletAddress(walletResponse.address);
        setStatus(walletResponse.status);
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
            setRevealedMessages(response.messages || []);
            setStatus(response.status);
        } catch (err) {
            setStatus(`Error: ${err.message}`);
        }
    };

    useEffect(() => {
        if (walletAddress) {
            handleRevealMessages();
        }
    }, [walletAddress]);

    const calculateTimeLeft = (unlockTime) => {
        const difference = unlockTime - new Date().getTime();
        let timeLeft = {};

        if (difference > 0) {
            timeLeft = {
                hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
                minutes: Math.floor((difference / 1000 / 60) % 60),
                seconds: Math.floor((difference / 1000) % 60),
            };
        }
    };

    return (
        <div className="container">
            <div className="header">
                <h1>Timelock dApp</h1>
                {!walletAddress && (
                    <button
                        className="walletBtn"
                        onClick={handleConnectWallet}
                    >
                        Connect Wallet
                    </button>
                )}

                {walletAddress && walletAddress.length > 0 && (
                    <p className="walletAddress">
                        Connected:{" "}
                        {`${walletAddress.substring(
                            0,
                            6
                        )}...${walletAddress.substring(
                            walletAddress.length - 6
                        )}`}
                    </p>
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
                    <button onClick={handleSetMessage}>Set Message</button>
                </div>
            )}
            <div className="messages">
                <h2>Messages</h2>
                <ul>
                    {revealedMessages.length > 0 ? (
                        revealedMessages.map((msg, index) => (
                            <li key={index}>
                                {msg.text} - {renderCountdown(msg.unlockTime)}
                            </li>
                        ))
                    ) : (
                        <li>No messages to display</li>
                    )}
                </ul>
            </div>
            <p>{status}</p>
        </div>
    );
};

export default Timelock;
