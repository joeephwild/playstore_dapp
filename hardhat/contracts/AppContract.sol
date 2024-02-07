// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/// @title AppNFT
/// @author NatX
/// @notice Contract that enables Developers/organization to create applications NFTs
/// @dev This is a template contract that Devs can deploy that will enable users mint applications and application packs
contract AppNFT is ERC1155, Ownable {
    using Counters for Counters.Counter; // OpenZeppelin Counter
    Counters.Counter private _idCount; // Counter for id of pack NFTs created

    uint256 public appPrice;
    address public routerAddress;

    struct Pack {
        uint256 price;
        uint256 maxQuantity;
        uint256 amountMinted;
    }

    mapping (uint256 => Pack) Packs;

    constructor (string memory uri_, uint256 _price, address _routerAddress) ERC1155(uri_) Ownable() {
        appPrice = _price;
        _idCount.increment();
        routerAddress = _routerAddress;
    }

    function createPack(uint256 quantity, uint256 price) external onlyOwner {
        Packs[_idCount.current()].maxQuantity = quantity;
        Packs[_idCount.current()].price = price;

        _idCount.increment();
    }

    // write modifier to allow only owner or main contract to mint token
    function mintPack(address to, uint256 id) external payable onlyRouter {
        require(Packs[id].maxQuantity > Packs[id].amountMinted, "Pack unavailable");
        require(msg.value == Packs[id].price, "Pay the correct amount");

        _mint(to, id, 1, "");
    }

    modifier onlyRouter() {
        require(msg.sender == routerAddress || msg.sender == owner(), "You are not allowed to call this function");
        _;
    }
}

