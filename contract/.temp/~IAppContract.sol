// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC1155/~ERC1155.sol";
import "./~IRouter.sol";
import "@openzeppelin/contracts/utils/~Counters.sol";
import "@openzeppelin/contracts/access/~Ownable.sol";

/// @title AppContract
/// @author NatX
/// @notice Contract that enables Developers/organization to create applications NFTs
/// @dev This is a template contract that Devs can deploy that will enable users mint applications and application packs
contract AppContract is ERC1155, Ownable {
    using Counters for Counters.Counter; // OpenZeppelin Counter
    Counters.Counter private _idCount; // Counter for id of pack NFTs created

    uint256 public appPrice;
    IAppRouter public router;

    struct Pack {
        uint256 price;
        uint256 maxQuantity;
        uint256 amountMinted;
    }

    mapping (uint256 => Pack) Packs;

    constructor (string memory uri_, uint256 _price, address _routerAddress) ERC1155(uri_) Ownable() {
        appPrice = _price;
        _idCount.increment();
        router = IAppRouter(_routerAddress);
        router.registerApp(address(this));
    }

    function createPack(uint256 quantity, uint256 price, address caller) external {
        require(caller == owner(), "You are not permitted to call this function");
        Packs[_idCount.current()].maxQuantity = quantity;
        Packs[_idCount.current()].price = price;

        _idCount.increment();
    }

    function buyPack(address to, uint256 id) external payable {
        require(msg.value == Packs[id].price, "Pay the correct amount");
        _mint(to, id, 1, "");
    }

    function getAllPacks() external view returns (Pack[] memory) {
    Pack[] memory packs = new Pack[](_idCount.current());
    for (uint256 i = 1; i < _idCount.current(); i++) {
        packs[i - 1] = Packs[i];
    }
    return packs;
}
}