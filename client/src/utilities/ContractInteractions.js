const alchemyKey = process.env.REACT_APP_ALCHEMY_KEY;
const { createAlchemyWeb3 } = require("@alch/alchemy-web3");
const web3 = createAlchemyWeb3(alchemyKey);

const contractABI = require("./contract-abi.json");
const contractAddress = process.env.REACT_APP_CONTRACT;

const timelockContract = new web3.eth.Contract(contractABI, contractAddress);

export const connectWallet = async () => {
    if (window.ethereum) {
        try {
            const addressArray = await window.ethereum.request({
                method: "eth_requestAccounts",
            });

            return {
                address: addressArray[0],
                status: "",
            };
        } catch (err) {
            return {
                address: "",
                status: err.message,
            };
        }
    } else {
        return {
            address: "",
            status: (
                <span>
                    Want to use this application? <br />
                    <a
                        target="blank"
                        href="https://metamask.io/download.html"
                    >
                        Install MetaMask for your browser!
                    </a>
                </span>
            ),
        };
    }
};

export const setMessage = async (message) => {
    if (window.ethereum) {
        try {
            const accounts = await window.ethereum.request({
                method: "eth_requestAccounts",
            });
            const account = accounts[0];

            await timelockContract.methods
                .setMessage(message)
                .send({ from: account });

            return {
                status: "Message set successfully!",
            };
        } catch (err) {
            return {
                address: "",
                status: err.message,
            };
        }
    } else {
        return {
            address: "",
            status: (
                <span>
                    Want to use this application? <br />
                    <a
                        target="blank"
                        href="https://metamask.io/download.html"
                    >
                        Install MetaMask for your browser!
                    </a>
                </span>
            ),
        };
    }
};

export const revealMessage = async () => {
    if (window.ethereum) {
        try {
            const messages = await timelockContract.methods
                .revealMessage()
                .call();

            return {
                messages,
                status: "",
            };
        } catch (err) {
            return {
                address: "",
                status: err.message,
            };
        }
    } else {
        return {
            address: "",
            status: (
                <span>
                    Want to use this application? <br />
                    <a
                        target="blank"
                        href="https://metamask.io/download.html"
                    >
                        Install MetaMask for your browser!
                    </a>
                </span>
            ),
        };
    }
};
