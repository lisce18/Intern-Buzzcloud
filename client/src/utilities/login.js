import React, { useEffect, useState } from "react";

const handleUser = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [accessToken, setAccessToken] = useState("");

    useEffect(() => {
        const token = sessionStorage.getItem("access_token");
        if (token) {
            setAccessToken(token);
            setIsAuthenticated(true);
        }
    }, []);

    const login = async () => {
        const sso = new SSOOIDC({
            region: "eu-north-1",
        });

        try {
            const params = {
                clientId: process.env.CLIENT_ID,
                clientSecret: process.env.CLIENT_SECRET,
                grantType: "authorization_code",
                code: "AUTHORIZATION_CODE",
                redirectUri: "REDIRECT_URI",
            };

            const tokenResponse = await sso.createToken(params).promise();
            const accessToken = tokenResponse.accessToken;

            sessionStorage.setItem("access_token", accessToken);
            setAccessToken(accessToken);
            setIsAuthenticated(true);
        } catch (error) {
            console.error("Login failed: ", error);
        }
    };

    const logout = () => {
        sessionStorage.removeItem("access_token");
        setAccessToken("");
        setIsAuthenticated(false);
    };

    return (
        <div>
            {isAuthenticated ? (
                <div>
                    <h2>Welcome!</h2>
                    <button onClick={logout}>Log out</button>
                </div>
            ) : (
                <div>
                    <h2>Please log in!</h2>
                    <button onClick={login}>Log in</button>
                </div>
            )}
        </div>
    );
};

export default handleUser;
