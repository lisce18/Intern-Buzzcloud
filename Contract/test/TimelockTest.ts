import { expect } from "chai";
import hre from "hardhat";

describe("TimelockTest", function () {
    const deployTimelockTestFixture = async () => {
        const [owner] = await hre.ethers.getSigners();

        const TimelockTest = await hre.ethers.getContractFactory(
            "TimelockTest"
        );
        const timelockTest = await TimelockTest.deploy();

        return { owner, timelockTest };
    };

    it("should convert 0 to '0'", async function () {
        const { timelockTest } = await deployTimelockTestFixture();

        expect(await timelockTest.testConvertToString(0)).to.equal("0");
    });

    it("should convert 123 to '123'", async function () {
        const { timelockTest } = await deployTimelockTestFixture();

        expect(await timelockTest.testConvertToString(123)).to.equal("123");
    });

    it("should convert 456789 to '456789'", async function () {
        const { timelockTest } = await deployTimelockTestFixture();

        expect(await timelockTest.testConvertToString(456789)).to.equal(
            "456789"
        );
    });

    it("should convert 1000000000 to '1000000000'", async function () {
        const { timelockTest } = await deployTimelockTestFixture();

        expect(await timelockTest.testConvertToString(1000000000)).to.equal(
            "1000000000"
        );
    });
});
