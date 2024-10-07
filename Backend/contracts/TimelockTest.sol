// SPDX-License-Identifier: MIT
pragma solidity ^0.8.27;

import "./Timelock.sol";

contract TimelockTest is Timelock {
    function testConvertToString(uint256 _i) public pure returns (string memory) {
        return convertToString(_i);
    }
}