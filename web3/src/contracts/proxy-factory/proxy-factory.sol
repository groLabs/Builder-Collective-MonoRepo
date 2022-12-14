// SPDX-License-Identifier: MIT
pragma solidity 0.8.10;

import "@openzeppelin/proxy/Clones.sol";
import "@openzeppelin/access/Ownable.sol";
import "forge-std/console2.sol";

contract BuidlerFactory is Ownable {

    address public implementationContract;
    string public implementationVersion;
    address[] public proxies;
    mapping(address => address) public proxyInfo;

    event LogNewBuilderProxyDeployed(address _clone, address _deployer);
    event LogBuilderContractUpdated(address _implementation, string _version);

    constructor(address _implementation) {
        implementationContract = _implementation;
        implementationVersion = "0.0.1";
    }

    function setImplementationContract(address _implementation, string memory _implementationVersion) external onlyOwner {
        implementationContract = _implementation;
        implementationVersion = _implementationVersion;
        emit LogBuilderContractUpdated(_implementation, _implementationVersion);
    }

    function createNewBuilder(bytes memory _dataPayload) payable external returns(address instance) {
        instance = Clones.clone(implementationContract);
        bool success;
        (success, ) = instance.call{value: msg.value}(_dataPayload);
        console2.log('initiate %s', success);
        require(success);
        bytes memory admin = abi.encodeWithSignature("updateAdmin(address)", msg.sender);
        (success, ) = instance.call{value: msg.value}(admin);
        require(success);
        proxies.push(instance);
        emit LogNewBuilderProxyDeployed(instance, msg.sender);
        return instance;
    }
}
