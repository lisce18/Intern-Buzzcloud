import { expect } from "chai";
import hre from "hardhat";

describe("Timelock", () => {
    const deployTimelockFixture = async () => {
        const [owner, addr1, addr2] = await hre.ethers.getSigners();

        const Timelock = await hre.ethers.getContractFactory("Timelock");
        const timelock = await Timelock.deploy();

        return { owner, addr1, addr2, timelock };
    };

    describe("Deployment", () => {
        it("Should deploy the contract correctly", async () => {
            const { timelock } = await deployTimelockFixture();

            expect(timelock.getAddress).to.not.be.undefined;
        });
    });

    describe("Messages", () => {
        it("Should set the message and reveal it correctly when unlockTime is up", async () => {
            const { timelock, addr1 } = await deployTimelockFixture();

            await timelock.connect(addr1).setMessage("Testing");

            await hre.network.provider.send("evm_increaseTime", [16]); // Increase time by 16 seconds
            await hre.network.provider.send("evm_mine"); // Mine a new block

            const messageAfter = await timelock.revealMessage();
            expect(messageAfter[0]).to.equal("Testing");
        });

        it("Should not be able to reveal message before unlockTime is up", async () => {
            const { timelock, addr1 } = await deployTimelockFixture();

            await timelock.connect(addr1).setMessage("Testing");

            await expect(timelock.revealMessage()).to.not.be.reverted;
        });

        it("Should be able to receive multiple messages", async () => {
            const { timelock, owner, addr1, addr2 } =
                await deployTimelockFixture();

            await timelock.connect(owner).setMessage("Testing1");
            await timelock.connect(addr1).setMessage("Testing2");
            await timelock.connect(addr2).setMessage("Testing3");

            await hre.network.provider.send("evm_increaseTime", [16]);
            await hre.network.provider.send("evm_mine");

            const messageAfter = await timelock.revealMessage();
            expect(messageAfter[0]).to.equal("Testing1");
            expect(messageAfter[1]).to.equal("Testing2");
        });

        it("Should be able to update the message", async () => {
            const { timelock, addr1 } = await deployTimelockFixture();

            await timelock.connect(addr1).setMessage("Testing");
            await timelock.connect(addr1).setMessage("Updated");

            await hre.network.provider.send("evm_increaseTime", [16]);
            await hre.network.provider.send("evm_mine");

            const messageAfter = await timelock.revealMessage();
            expect(messageAfter[0]).to.equal("Updated");
        });

        it("Should update the message and set a new unlock time when a previous message is set and unlock time is up", async () => {
            const { timelock, addr1 } = await deployTimelockFixture();

            await timelock.connect(addr1).setMessage("Testing");

            await hre.network.provider.send("evm_increaseTime", [16]);
            await hre.network.provider.send("evm_mine");

            await timelock.connect(addr1).setMessage("Updated");

            await hre.network.provider.send("evm_increaseTime", [16]);
            await hre.network.provider.send("evm_mine");

            const messageAfter = await timelock.revealMessage();
            expect(messageAfter[0]).to.equal("Updated");
        });
    });
});
