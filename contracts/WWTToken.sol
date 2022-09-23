// SPDX-License-Identifier: MIT
pragma solidity 0.8.11;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "./StateHash.sol";

contract WWTToken is ERC721, StateHash {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;
    mapping(uint256 => bytes32) internal stateHashes;

    constructor(address _to) ERC721("WWTToken", "WWT") {
        mint(_to);
    }

    function mint(address to) public returns (uint256) {
        _tokenIds.increment();

        uint256 tokenId = _tokenIds.current();
        _mint(to, tokenId);

        return tokenId;
    }

    function setStateHash(uint256 tokenId, bytes32 _stateHash) external {
        stateHashes[tokenId] = _stateHash;
    }

    function stateHash(uint256 tokenId)
        external
        view
        override
        returns (bytes32)
    {
        bytes32 _stateHash = stateHashes[tokenId];

        return _stateHash;
    }
}
