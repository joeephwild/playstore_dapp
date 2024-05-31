// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity ^0.8.0;

import "./~IAppContract.sol";
import "@openzeppelin/contracts/utils/~Counters.sol";
import "@openzeppelin/contracts/access/~Ownable.sol";

contract AppRouter is Ownable {
    using Counters for Counters.Counter;
    Counters.Counter private _appId;

    mapping (uint256 => address) public Apps;

    constructor () Ownable() {}

    // register app
    function registerApp(address appAddress) external {
        Apps[_appId.current()] = appAddress;
        _appId.increment();
    }

    function createAppPack(uint256 appId, uint256 quantity, uint256 price) external {
        address appAddress = Apps[appId];
        IAppContract app = IAppContract(appAddress);
        app.createPack(quantity, price, msg.sender);
    }

    // buy Pack
    function buyAppPack(uint256 appId, uint256 packId) external payable {
        address appAddress = Apps[appId];
        IAppContract app = IAppContract(appAddress);
        app.buyPack(msg.sender, packId);
    }
}