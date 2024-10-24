import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const TimelockModule = buildModule("TimelockModule", (m) => {
    const timelock = m.contract("Timelock", [], {});

    return { timelock };
});

export default TimelockModule;
