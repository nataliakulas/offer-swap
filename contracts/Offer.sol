// SPDX-License-Identifier: MIT
pragma solidity 0.8.11;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";

contract Offer is Ownable, IERC721Receiver {
    using SafeERC20 for IERC20;

    address public buyer;
    address public seller;
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

    event Cancelled(uint256 _balance);

    constructor(
        address _buyer,
        address _seller,
        address _erc721,
        uint256 _tokenId,
        address _erc20,
        uint256 _amount,
        uint40 _expirationDate
    ) {
        require(_buyer == msg.sender || _seller == msg.sender);
        require(_buyer != _seller);
        buyer = _buyer;
        seller = _seller;
        erc721 = IERC721(_erc721);
        tokenId = _tokenId;
        erc20 = IERC20(_erc20);
        amount = _amount;
        expirationDate = _expirationDate;
    }

    function swapAsBuyer() external {
        address _buyer = buyer;
        if (_buyer == address(0)) {
            _buyer = msg.sender;
            
        } else {
            require(_buyer == msg.sender, "Caller is not buyer");
        }

        require(expirationDate > block.timestamp, "Offer has expired");

        address _seller = owner();
        
        _swap(_seller, _buyer);
    }

    function swapAsSeller() external {
        address _seller = seller;
        if (_seller == address(0)) {
            _buyer = msg.sender;
        } else {
            require(_seller == msg.sender, "Caller is not buyer");
        }

        require(expirationDate > block.timestamp, "Offer has expired");

        address _buyer = owner();
        
        _swap(_seller, _buyer);
    }

    function _swap(address _seller, address _buyer) internal {
        emit Bought(
            _seller,
            _buyer,
            address(erc721),
            tokenId,
            address(erc20),
            amount,
            expirationDate
        );

        erc721.safeTransferFrom(_seller, _buyer, tokenId);
        erc20.safeTransferFrom(_buyer, _seller, amount);

        delete buyer;
        delete seller;
        delete tokenId;
        delete amount;
        delete expirationDate;

        selfdestruct(payable(msg.sender));
    }

    function cancel() external onlyOwner {
        emit Cancelled(address(this).balance);

        selfdestruct(payable(owner()));
    }
    
    function onERC721Recived(adress /* operator */, address from, uint256 _tokenId, bytes memory data) external override {
        require(msg.sender == _erc721);
        require(tokenId == _tokenId);
        if (seller != address(0)) {
            require(from == seller);
        }
        _swap(from, buyer);
        return ...
    }
}
