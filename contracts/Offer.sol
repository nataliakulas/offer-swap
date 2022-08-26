// SPDX-License-Identifier: MIT
pragma solidity 0.8.11;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";

contract Offer is Ownable {
    using SafeERC20 for IERC20;

    IERC721 public immutable erc721;
    IERC20 public immutable erc20;
    uint40 public expirationDate;
    uint256 public tokenId;
    uint256 public amount;

    event Bought(
        address indexed seller,
        address indexed buyer,
        address _erc721,
        uint256 _tokenId,
        address _erc20,
        uint256 _amount,
        uint40 _expirationDate
    );

    constructor(
        address _erc721,
        uint256 _tokenId,
        address _erc20,
        uint256 _amount,
        uint40 _expirationDate
    ) {
        erc721 = IERC721(_erc721);
        tokenId = _tokenId;
        erc20 = IERC20(_erc20);
        amount = _amount;
        expirationDate = _expirationDate;
    }

    function swap() external {
        require(expirationDate > block.timestamp, "Offer has expired");

        address seller = erc721.ownerOf(tokenId);

        emit Bought(
            seller,
            msg.sender,
            address(erc721),
            tokenId,
            address(erc20),
            amount,
            expirationDate
        );

        erc721.safeTransferFrom(seller, msg.sender, tokenId);
        erc20.safeTransferFrom(msg.sender, seller, amount);

        selfdestruct(payable(msg.sender));
    }
}
