// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import "./Base.t.sol";
import "../src/contracts/BuidlCollective.sol";
import "../src/contracts/proxy-factory/proxy-factory.sol";
import "forge-std/console2.sol";

contract factoryTest is BaseSetup {
    using stdStorage for StdStorage;

    BuidlCollective BCP;
    BuidlerFactory bFactory;

    function setUp() public virtual override {
        BaseSetup.setUp();

        vm.startPrank(BASED_ADDRESS);
        BCP = new BuidlCollective("test pool", "TP", 18);
        bFactory = new BuidlerFactory(address(BCP));
        BCP.setAdmin(address(bFactory));
        vm.stopPrank();
    }

    function testDeployClone() public {
        vm.startPrank(alice);
        Collective memory colInfo = Collective(1000, 100, 0);
        address[] memory tokens = new address[](4);
        address[] memory participants = new address[](4);
        uint128[] memory prices = new uint128[](4);
        uint256[] memory targets = new uint256[](4);
        string[] memory names = new string[](4);

        for (uint256 i; i < 4; i++) {
            tokens[i] = createToken();
            prices[i] = 1E8;
            targets[i] = 100E18;
            participants[i] = users[i + 1];
            names[i] = "test user";
        }

        bytes memory data = abi.encodeWithSignature(
            "initialize(string[],(uint32,uint32,uint32),address[],uint128[],address[],uint256[])",
            names,
            colInfo,
            tokens,
            prices,
            participants,
            targets
        );
        address proxy = bFactory.createNewBuilder(data);
        console2.log("proxy %s %s", proxy, bFactory.proxies(0));
    }
}
