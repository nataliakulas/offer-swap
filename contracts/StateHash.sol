// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface StateHash {
    function stateHash(uint256 tokenId) external view returns (bytes32);
}
