import React, { useEffect, useState } from "react";
import { login, getAccessToken, logout } from "../utilities/login";
import { setMessage, revealMessage } from "../utilities/ContractInteractions";
import { useNavigate } from "react-router-dom";

const Timelock = () => {
    const [message, setMessageText] = useState("");
    const [revealedMessages, setRevealedMessages] = useState([]);
    const [status, setStatus] = useState("Connect wallet to display messages.");
    const [accessToken, setAccessToken] = useState("");
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        const token = getAccessToken();
        if (token) {
            setAccessToken(token);
            setIsAuthenticated(true);
            handleRevealMessages();
        }
    });

    const handleLogin = async () => {
        try {
            const token = await login();
            if (token) {
                setAccessToken(token);
                setIsAuthenticated(true);
                setStatus("Log in sucessfull!");
                handleRevealMessages();
            }
        } catch (err) {
            setStatus(`Log in failed: ${err.message}`);
        }
    };

    const handleLogout = () => {
        logout();
        setAccessToken("");
        setIsAuthenticated(false);
        setStatus("Logged out!");
    };

    const handleSetMessage = async () => {
        if (isAuthenticated && accessToken) {
            try {
                const response = await setMessage(message, accessToken);
                setStatus(response.status);
                await handleRevealMessages();
            } catch (err) {
                setStatus(`Error: ${err.message}`);
            }
        } else {
            setStatus("Please log in first!");
        }
    };

    const handleRevealMessages = async () => {
        try {
            const response = await revealMessage();
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

    return (
        <div className="container">
            <div className="header">
                <h1 className="title">
                    <p>Timelock</p>
                    <p>dApp</p>
                </h1>
                {!isAuthenticated && (
                    <button
                        className="loginBtn"
                        onClick={handleLogin}
                    >
                        Log In
                    </button>
                )}

                {isAuthenticated && (
                    <>
                        <div className="block">
                            <p className="status">Logged in successfully.</p>
                            <button
                                className="logoutBtn"
                                onClick={handleLogout}
                            >
                                Log Out
                            </button>
                        </div>
                    </>
                )}
            </div>

            {isAuthenticated && (
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
                    {isAuthenticated && revealedMessages.length > 0 ? (
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
