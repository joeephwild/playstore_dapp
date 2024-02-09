// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity ^0.8.0;

interface IAppContract {
    
    function createPack(uint256 quantity, uint256 price, address caller) external;

    function buyPack(address to, uint256 id) external payable;
}