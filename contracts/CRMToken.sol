// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract CRMToken is ERC20 {
    constructor(address to, uint256 initialSupply) ERC20("Cream", "CRM") {
        _mint(to, initialSupply);
    }
}
