// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";

contract Offer is Ownable {
    IERC721 public ERC721;
    IERC20 public ERC20;
    uint256 public tokenId;
    uint256 public amount;

    event Bought(uint256 tokenId, uint256 amount);

    constructor(
        address _ERC721,
        uint256 _tokenId,
        address _ERC20,
        uint256 _amount
    ) {
        ERC721 = IERC721(_ERC721);
        tokenId = _tokenId;
        ERC20 = IERC20(_ERC20);
        amount = _amount;
    }

    function swap(
        uint256 tokenId,
        uint256 amount,
        address seller
    ) public {
        require(seller == ERC721.ownerOf(tokenId), "Seller is not the owner");
        require(
            ERC721.getApproved(tokenId) == address(this),
            "ERC721 is not approved"
        );
        require(ERC20.balanceOf(msg.sender) >= amount, "Not enough funds");

        ERC20.approve(address(this), amount);
        require(
            ERC20.allowance(msg.sender, address(this)) >= amount,
            "ERC20 is not approved"
        );

        ERC721.safeTransferFrom(seller, msg.sender, tokenId);
        ERC20.transfer(seller, amount);

        emit Bought(tokenId, amount);
    }
}
