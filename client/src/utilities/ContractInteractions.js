import { Biconomy } from "@biconomy/mexa";
import Web3 from "web3";

const biconomy = new Biconomy(
    new Web3.providers.HttpProvider(process.env.ALCHEMY_KEY),
    {
        apiKey: process.env.BICONOMY_API_KEY,
        debug: true,
    }
);

const web3 = new Web3(biconomy);

biconomy
    .onEvent(biconomy.readOnlyProvider, () => {
        console.log("Biconomy is ready to realy transactions!");
    })
    .onEvent(biconomy.readOnlyProvider, (error, message) => {
        console.error("Error while initializing Biconomy: ", error, message);
    });

const contractABI = require("./contract-abi.json");
const contractAddress = process.env.CONTRACT;
const timelockContract = new web3.eth.Contract(contractABI, contractAddress);

export const setMessage = async (message, accessToken) => {
    try {
        const accounts = await web3.eth.getAccounts();
        const account = accounts[0];

        const tx = await timelockContract.methods.setMessage(message).send({
            from: account,
            signatureType: biconomy.EIP712_SIGN,
        });

        return {
            status: "Message set successfully!",
            transactionHash: tx.transactionHash,
        };
    } catch (err) {
        return {
            status: `Error: ${err.message}`,
        };
    }
};

export const revealMessage = async () => {
    try {
        const messages = await timelockContract.methods.revealMessage().call();
        return {
            messages,
        };
    } catch (err) {
        return {
            status: `Error: ${err.message}`,
        };
    }
};

// const alchemyKey = process.env.REACT_APP_ALCHEMY_KEY;
// const { createAlchemyWeb3 } = require("@alch/alchemy-web3");
// const web3 = createAlchemyWeb3(alchemyKey);

// const contractABI = require("./contract-abi.json");
// const contractAddress = process.env.REACT_APP_CONTRACT;

// const timelockContract = new web3.eth.Contract(contractABI, contractAddress);

// export const connectWallet = async () => {
//     if (window.ethereum) {
//         try {
//             const addressArray = await window.ethereum.request({
//                 method: "eth_requestAccounts",
//             });

//             return {
//                 address: addressArray[0],
//                 status: "",
//             };
//         } catch (err) {
//             return {
//                 address: "",
//                 status: err.message,
//             };
//         }
//     } else {
//         return {
//             address: "",
//             status: (
//                 <span>
//                     Want to use this application? <br />
//                     <a
//                         target="blank"
//                         href="https://metamask.io/download.html"
//                     >
//                         Install MetaMask for your browser!
//                     </a>
//                 </span>
//             ),
//         };
//     }
// };

// export const setMessage = async (message) => {
//     if (window.ethereum) {
//         try {
//             const accounts = await window.ethereum.request({
//                 method: "eth_requestAccounts",
//             });
//             const account = accounts[0];

//             await timelockContract.methods
//                 .setMessage(message)
//                 .send({ from: account });

//             return {
//                 status: "Message set successfully!",
//             };
//         } catch (err) {
//             return {
//                 address: "",
//                 status: err.message,
//             };
//         }
//     } else {
//         return {
//             address: "",
//             status: (
//                 <span>
//                     Want to use this application? <br />
//                     <a
//                         target="blank"
//                         href="https://metamask.io/download.html"
//                     >
//                         Install MetaMask for your browser!
//                     </a>
//                 </span>
//             ),
//         };
//     }
// };

// export const revealMessage = async () => {
//     if (window.ethereum) {
//         try {
//             const messages = await timelockContract.methods
//                 .revealMessage()
//                 .call();

//             return {
//                 messages,
//                 status: "",
//             };
//         } catch (err) {
//             return {
//                 address: "",
//                 status: err.message,
//             };
//         }
//     } else {
//         return {
//             address: "",
//             status: (
//                 <span>
//                     Want to use this application? <br />
//                     <a
//                         target="blank"
//                         href="https://metamask.io/download.html"
//                     >
//                         Install MetaMask for your browser!
//                     </a>
//                 </span>
//             ),
//         };
//     }
// };
