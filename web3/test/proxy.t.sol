// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import "./Base.t.sol";
import "../src/contracts/BuidlCollective.sol";
import "../src/contracts/proxy-factory/proxy-factory.sol";
import "../src/contracts/mocks/MockERC20.sol";
import "@forge-std/console2.sol";

contract factoryTest is BaseSetup {
    using stdStorage for StdStorage;

    BuidlCollective BCP;
    BuidlerFactory bFactory;

    function setUp() public virtual override {
        BaseSetup.setUp();

        vm.startPrank(BASED_ADDRESS);
        BCP = new BuidlCollective("test pool", "TP", 18);
        bFactory = new BuidlerFactory(address(BCP));
        BCP.updateAdmin(address(bFactory));
        vm.stopPrank();
    }

    function deployClone() public returns (address) {
        uint256[] memory _targets = new uint256[](2);
        _targets[0] = 2000000000000000000;
        _targets[1] = 2000000;

        uint128[] memory _prices = new uint128[](2);
        _prices[0] = 50;
        _prices[1] = 50;

        address tokenA = mockToken(_targets[0], alice);
        address tokenB = mockToken(_targets[1], bob);

        // vestingPeriod, cliff, startTime, startTime would be updated anyway upon start;
        Collective memory _ci = Collective(uint32(59), uint32(30), uint32(0));
        address[] memory _tokens = new address[](2);
        address[] memory _users = new address[](2);
        string[] memory _userNames = new string[](2);
        _userNames[0] = "alice";
        _userNames[1] = "bob";
        _tokens[0] = tokenA;
        _tokens[1] = tokenB;
        _users[0] = alice;
        _users[1] = bob;

        vm.prank(BASED_ADDRESS);

        bytes memory data = abi.encodeWithSignature(
            "initialize(string[],(uint32,uint32,uint32),address[],uint128[],address[],uint256[])",
            _userNames,
            _ci,
            _tokens,
            _prices,
            _users,
            _targets
        );
        address proxy = bFactory.createNewBuilder(data);
        vm.stopPrank();
        console2.log("proxy %s %s", proxy, bFactory.proxies(0));

        vm.prank(alice);
        ERC20(tokenA).approve(proxy, _targets[0]);
        vm.stopPrank();

        vm.prank(bob);
        ERC20(tokenB).approve(proxy, _targets[1]);
        vm.stopPrank();
        return proxy;
    }

    function testClone() public {
        BuidlCollective proxy = BuidlCollective(deployClone());

        ERC20 tA = ERC20(proxy.tokens(0));
        ERC20 tB = ERC20(proxy.tokens(1));
        console2.log("proxy: admin %s based %s", proxy.admin(), BASED_ADDRESS);
        vm.prank(BASED_ADDRESS);
        proxy.startCollective();
        vm.stopPrank();

        (
            uint256 depositedShare,
            uint256 accClaimable,
            uint256 lastCheckpointTWAP,
            uint256 lastCheckpointTime,
            uint256 lastCheckpointPercentageVested
        ) = proxy.userInfo(alice);
        console2.log(
            "alice userInfo: depositedShare %s lastCheckpointTWAP %s",
            depositedShare,
            lastCheckpointTWAP
        );
        console2.log(
            "alice userInfo: lastCheckpointTime %s lastCheckpointPercentageVested %s",
            lastCheckpointTime,
            lastCheckpointPercentageVested
        );

        uint256 aliceBalance = proxy.balanceOf(alice);
        console2.log("balance of alice", aliceBalance);
        vm.prank(alice);
        proxy.stake(aliceBalance / 2);
        vm.stopPrank();
        aliceBalance = proxy.balanceOf(alice);
        console2.log("balance of alice post stake", aliceBalance);

        (
            depositedShare,
            accClaimable,
            lastCheckpointTWAP,
            lastCheckpointTime,
            lastCheckpointPercentageVested
        ) = proxy.userInfo(alice);
        console2.log(
            "alice userInfo: depositedShare %s lastCheckpointTWAP %s",
            depositedShare,
            lastCheckpointTWAP
        );
        console2.log(
            "alice userInfo: lastCheckpointTime %s lastCheckpointPercentageVested %s",
            lastCheckpointTime,
            lastCheckpointPercentageVested
        );

        uint256 vestedPercent = proxy.getVestingPercent();
        uint256[] memory aliceVested = proxy.getClaimable(alice);
        console2.log("vestedPercent %s", vestedPercent);
        console2.log("alice vested %s %s", aliceVested[0], aliceVested[1]);

        vm.warp(block.timestamp + 5500050);
        console2.log("post warp \n");

        (
            depositedShare,
            accClaimable,
            lastCheckpointTWAP,
            lastCheckpointTime,
            lastCheckpointPercentageVested
        ) = proxy.userInfo(alice);
        console2.log(
            "alice userInfo: depositedShare %s lastCheckpointTWAP %s",
            depositedShare,
            lastCheckpointTWAP
        );
        console2.log(
            "alice userInfo: lastCheckpointTime %s lastCheckpointPercentageVested %s",
            lastCheckpointTime,
            lastCheckpointPercentageVested
        );
        vestedPercent = proxy.getVestingPercent();
        aliceVested = proxy.getClaimable(alice);
        console2.log("vestedPercent %s", vestedPercent);
        console2.log("alice vested %s %s", aliceVested[0], aliceVested[1]);

        console2.log(
            "coll balances token A %s B %s",
            tA.balanceOf(address(proxy)),
            tB.balanceOf(address(proxy))
        );
        console2.log(
            "alice balances token A %s B %s",
            tA.balanceOf(alice),
            tB.balanceOf(alice)
        );

        vm.prank(alice);
        console2.log("stake more alice \n");
        proxy.stake(aliceBalance);
        (
            depositedShare,
            accClaimable,
            lastCheckpointTWAP,
            lastCheckpointTime,
            lastCheckpointPercentageVested
        ) = proxy.userInfo(alice);
        console2.log("re-stake Alice Info: (depositedShare, accClaimable) ", depositedShare, accClaimable);
        console2.log("unstake alice \n");
        // does not allow same block unstake
        skip(block.timestamp + 5500050);
        vm.prank(alice);

        proxy.unstakeAll();
        
        aliceBalance = proxy.balanceOf(alice);
        console2.log("balance of alice post unStake", aliceBalance);

        console2.log("post stake");
        console2.log(
            "coll balances token A %s B %s",
            tA.balanceOf(address(proxy)),
            tB.balanceOf(address(proxy))
        );
        console2.log(
            "alice balances token A %s B %s",
            tA.balanceOf(alice),
            tB.balanceOf(alice)
        );

        (
            depositedShare,
            accClaimable,
            lastCheckpointTWAP,
            lastCheckpointTime,
            lastCheckpointPercentageVested
        ) = proxy.userInfo(alice);
        console2.log(
            "alice userInfo: depositedShare %s lastCheckpointTWAP %s",
            depositedShare,
            lastCheckpointTWAP
        );
        console2.log(
            "alice userInfo: lastCheckpointTime %s lastCheckpointPercentageVested %s",
            lastCheckpointTime,
            lastCheckpointPercentageVested
        );

        vestedPercent = proxy.getVestingPercent();
        aliceVested = proxy.getClaimable(alice);
        console2.log("vestedPercent %s", vestedPercent);
        console2.log("alice vested %s %s", aliceVested[0], aliceVested[1]);
        aliceBalance = proxy.balanceOf(alice);
        console2.log("balance of alice post stake", aliceBalance);

        vm.stopPrank();

        console2.log("post 2nd deposit \n");
    }
}