// SPDX-License-Identifier: MIT

pragma solidity ^0.8.19;

import "@openzeppelin/contracts/utils/Counters.sol";

contract StoreContract {
    using Counters for Counters.Counter;

    struct App {
        string uri;
        address payable owner;
        uint256 price;
    }

    App[] public allApp;
    mapping(address => Counters.Counter) private addressAppCount;
    mapping(uint256 => App) public idToApp;

    event AppUploaded(uint256 indexed appId, string uri, address indexed owner, uint256 price);
    event AppInstalled(uint256 indexed appId, address indexed buyer, address indexed owner, uint256 price);

    function uploadAnApp(string memory _appUri, uint256 _amount) external {
        App memory newApp = App(_appUri, payable(msg.sender), _amount);
        allApp.push(newApp);
        uint256 appId = allApp.length - 1;
        idToApp[appId] = newApp;
        addressAppCount[msg.sender].increment();
        emit AppUploaded(appId, _appUri, msg.sender, _amount);
    }

    function installApp(uint256 _appId) external payable {
        App storage app = idToApp[_appId];
        require(msg.value >= app.price, "Insufficient Funds");
        require(msg.sender != app.owner, "Owner can't download");
        
        (bool success, ) = app.owner.call{value: msg.value}("");
        require(success, "Failed to send Ether");

        emit AppInstalled(_appId, msg.sender, app.owner, app.price);
    }

    function getApp(uint256 _appId) external view returns (App memory) {
        return idToApp[_appId];
    }

    function getAllApps() external view returns (App[] memory) {
        return allApp;
    }

    function getOwnerAppCount(address _owner) external view returns (uint256) {
        return addressAppCount[_owner].current();
    }

    function getAllAppURIs() external view returns (string[] memory) {
    uint256 appCount = allApp.length;
    string[] memory uris = new string[](appCount);

    for (uint256 i = 0; i < appCount; i++) {
        uris[i] = allApp[i].uri;
    }

    return uris;
}

function getUserAppURI(address _user, uint256 _index) external view returns (string memory) {
    require(_index < addressAppCount[_user].current(), "Index out of range");
    
    uint256 count = 0;
    for (uint256 i = 0; i < allApp.length; i++) {
        if (allApp[i].owner == _user) {
            if (count == _index) {
                return allApp[i].uri;
            }
            count++;
        }
    }
    
    revert("App not found");
}


}
