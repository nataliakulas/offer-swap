// SPDX-License-Identifier: MIT
pragma solidity 0.8.11;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";

contract Offer is Ownable {
    IERC721 public immutable erc721;
    using SafeERC20 for IERC20;
    IERC20 public immutable erc20;
    uint256 public tokenId;
    uint256 public amount;

    event Bought(
        address indexed seller,
        address indexed buyer,
        address _erc721,
        uint256 _tokenId,
        address _erc20,
        uint256 _amount
    );

    constructor(
        address _erc721,
        uint256 _tokenId,
        address _erc20,
        uint256 _amount
    ) {
        erc721 = IERC721(_erc721);
        tokenId = _tokenId;
        erc20 = IERC20(_erc20);
        amount = _amount;
    }

    function swap() external {
        address seller = erc721.ownerOf(tokenId);

        emit Bought(
            seller,
            msg.sender,
            address(erc721),
            tokenId,
            address(erc20),
            amount
        );

        erc721.safeTransferFrom(seller, msg.sender, tokenId);
        erc20.safeTransferFrom(msg.sender, seller, amount);

        selfdestruct(payable(msg.sender));
    }
}
