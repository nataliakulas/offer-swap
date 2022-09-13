// SPDX-License-Identifier: MIT
pragma solidity 0.8.11;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";

contract Offer is Ownable {
    using SafeERC20 for IERC20;

    address public buyer;
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
        address _buyer,
        address _erc721,
        uint256 _tokenId,
        address _erc20,
        uint256 _amount,
        uint40 _expirationDate
    ) {
        buyer = _buyer;
        erc721 = IERC721(_erc721);
        tokenId = _tokenId;
        erc20 = IERC20(_erc20);
        amount = _amount;
        expirationDate = _expirationDate;
    }

    function swap() external {
        address _buyer = buyer;
        if (_buyer == address(0)) {
            _buyer = msg.sender;
        } else {
            require(_buyer == msg.sender, "Caller is not buyer");
        }

        require(expirationDate > block.timestamp, "Offer has expired");

        address seller = erc721.ownerOf(tokenId);

        emit Bought(
            seller,
            _buyer,
            address(erc721),
            tokenId,
            address(erc20),
            amount,
            expirationDate
        );

        erc721.safeTransferFrom(seller, _buyer, tokenId);
        erc20.safeTransferFrom(_buyer, seller, amount);

        selfdestruct(payable(_buyer));
    }
}
