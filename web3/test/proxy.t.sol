// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import "./Base.t.sol";
import "../src/contracts/BuidlCollective.sol";
import "../src/contracts/proxy-factory/proxy-factory.sol";
import "../src/contracts/mocks/MockERC20.sol";
import "forge-std/console2.sol";

contract factoryTest is BaseSetup {
    using stdStorage for StdStorage;

    BuidlCollective BCP;
    BuidlerFactory bFactory;
    BuidlCollective proxy;

    function setUp() public virtual override {
        BaseSetup.setUp();

        vm.startPrank(BASED_ADDRESS);
        BCP = new BuidlCollective("test pool", "TP", 18);
        bFactory = new BuidlerFactory(address(BCP));
        BCP.setAdmin(address(bFactory));
        vm.stopPrank();
    }

    function genData(Collective memory _ci) public returns (bytes memory, uint256[] memory, address[] memory) {
        uint256[] memory _targets = new uint256[](3);
        _targets[0] = 200 * 1E18;
        _targets[1] = 200 * 1E18;
        _targets[2] = 200 * 1E6;

        uint128[] memory _prices = new uint128[](3);
        _prices[0] = 25 * 1E8;
        _prices[1] = 30 * 1E8;
        _prices[2] = 50 * 1E8;

        address tokenA = mockToken(_targets[0], alice, 18);
        address tokenB = mockToken(_targets[1], bob, 18);
        address tokenC = mockToken(_targets[2], charlie, 6);

        // vestingPeriod, cliff, startTime, startTime would be updated anyway upon start;
        address[] memory _tokens = new address[](3);
        address[] memory _users = new address[](3);
        string[] memory _userNames = new string[](3);
        _userNames[0] = "alice";
        _userNames[1] = "bob";
        _userNames[2] = "charlie";
        _tokens[0] = tokenA;
        _tokens[1] = tokenB;
        _tokens[2] = tokenC;
        _users[0] = alice;
        _users[1] = bob;
        _users[2] = charlie;


        bytes memory data = abi.encodeWithSignature(
            "initialize(string[],(uint32,uint32,uint32),address[],uint128[],address[],uint256[])",
            _userNames,
            _ci,
            _tokens,
            _prices,
            _users,
            _targets
        );
        return (data, _targets, _tokens);
    }

    function deployClone() public returns (address, uint32, uint32) {
        uint32 vestingPeriod = 2100;
        uint32 vestingCliff = 100;
        Collective memory _ci = Collective(vestingPeriod, vestingCliff, uint32(0));
        (bytes memory data, uint256[] memory _targets, address[] memory _tokens) = genData(_ci);

        vm.startPrank(BASED_ADDRESS);
        address _proxy = bFactory.createNewBuilder(data);
        vm.stopPrank();
        console2.log("proxy %s %s", _proxy, bFactory.proxies(0));

        vm.startPrank(alice);
        ERC20(_tokens[0]).approve(_proxy, _targets[0]);
        vm.stopPrank();
        vm.startPrank(bob);
        ERC20(_tokens[1]).approve(_proxy, _targets[1]);
        vm.stopPrank();
        vm.startPrank(charlie);
        ERC20(_tokens[2]).approve(_proxy, _targets[2]);
        vm.stopPrank();
        return (_proxy, vestingPeriod, vestingCliff);
    }

    function testClone() public {
        (address _proxy, uint32 vestingPeriod, uint32 vestingCliff) = deployClone();
        proxy = BuidlCollective(_proxy);

        ERC20 tA = ERC20(proxy.tokens(0));
        ERC20 tB = ERC20(proxy.tokens(1));
        ERC20 tC = ERC20(proxy.tokens(2));
        console2.log("proxy: admin %s based %s", proxy.admin(), BASED_ADDRESS);
        vm.startPrank(BASED_ADDRESS);
        proxy.startCollective();
        vm.stopPrank();

        (
            uint256 depositedShare,
            uint256 rewardDebt
        ) = proxy.userInfo(alice);
        console2.log(
            "alice userInfo: depositedShare %s",
            depositedShare
        );
        console2.log(
            rewardDebt
        );

        uint256 aliceBalance = proxy.balanceOf(alice);
        console2.log("balance of alice", aliceBalance);
        vm.startPrank(alice);
        proxy.stake(aliceBalance / 2);
        vm.stopPrank();
        aliceBalance = proxy.balanceOf(alice);
        console2.log("balance of alice post stake", aliceBalance);

        (
            depositedShare,
            rewardDebt
        ) = proxy.userInfo(alice);
        console2.log(
            "alice userInfo: depositedShare %s",
            depositedShare
        );
        console2.log(
            rewardDebt
        );

        console2.log("\n");
        console2.log("test 1\n");
        uint256[] memory aliceVested = proxy.getClaimable(alice);
        console2.log("alice vested %s %s", aliceVested[0], aliceVested[1]);

        vm.warp(block.timestamp + vestingPeriod/5);
        console2.log("post warp \n");

        (
            depositedShare,
            rewardDebt
        ) = proxy.userInfo(alice);
        console2.log(
            "alice userInfo: depositedShare %s",
            depositedShare
        );
        console2.log(
            rewardDebt
        );

        console2.log("\n");
        console2.log("test 2\n");
        aliceVested = proxy.getClaimable(alice);
        console2.log("alice vested %s %s", aliceVested[0], aliceVested[1]);

        console2.log(
            "coll balances token A %s B %s ",
            tA.balanceOf(address(proxy)),
            tB.balanceOf(address(proxy)),
            tC.balanceOf(address(proxy))
        );
        console2.log(
            "alice balances token A %s B %s",
            tA.balanceOf(alice),
            tB.balanceOf(alice),
            tC.balanceOf(alice)
        );

        vm.startPrank(alice);
        //console2.log("stake more alice \n");
        //proxy.stake(aliceBalance);
        console2.log("2nd stake alice \n");
        proxy.unstakeAll();

        console2.log("test 3\n");
        aliceVested = proxy.getClaimable(alice);
        console2.log("alice vested %s %s", aliceVested[0], aliceVested[1]);
        aliceBalance = proxy.balanceOf(alice);
        console2.log("balance of alice post stake", aliceBalance);

        console2.log("-------post stake----------");
        console2.log(
            "coll balances token A %s B %s",
            tA.balanceOf(address(proxy)),
            tB.balanceOf(address(proxy)),
            tC.balanceOf(address(proxy))
        );
        console2.log(
            "alice balances token A %s B %s",
            tA.balanceOf(alice),
            tB.balanceOf(alice),
            tC.balanceOf(alice)
        );

        (
            depositedShare,
            rewardDebt
        ) = proxy.userInfo(alice);
        console2.log(
            "alice userInfo: depositedShare %s",
            depositedShare
        );
        console2.log(
            rewardDebt
        );
        vm.stopPrank();

        console2.log("post 2nd deposit \n");
    }

    function _userInfo(address _user) public {
        (
            uint256 depositedShare,
            uint256 rewardDebt
        ) = proxy.userInfo(_user);

        console2.log(
            "depositedShare %s rewardDebt %s",
            depositedShare,
            rewardDebt
        );
    }

    function _userBalance(address _user) public {
        uint256 balance = proxy.balanceOf(_user);
        console2.log("balance %s", balance);
    }

    function _userClaimable(address _user) public {
        uint256[] memory vested = proxy.getClaimable(_user);
        console2.log("\nvested %s %s %s", vested[0], vested[1], vested[2]);
    }

    function _stake(address _user, uint256 div) public {
        console2.log("stake %s %s", _user, address(proxy));
        vm.startPrank(_user);
        uint256 balance = proxy.balanceOf(_user);
        proxy.stake(balance / div);
        vm.stopPrank();
    }

    function _balanceOfAssets(address _user) public {
        ERC20 tA = ERC20(proxy.tokens(0));
        ERC20 tB = ERC20(proxy.tokens(1));
        ERC20 tC = ERC20(proxy.tokens(2));
        console2.log(
            "coll balances token A %s B %s C %s",
            tA.balanceOf(_user),
            tB.balanceOf(_user),
            tC.balanceOf(_user)
        );
    }

    function testCloneMultipleStakes() public {
        (address _proxy, uint32 vestingPeriod, uint32 vestingCliff) = deployClone();
        proxy = BuidlCollective(_proxy);

        vm.startPrank(BASED_ADDRESS);
        proxy.startCollective();
        vm.stopPrank();

        vm.warp(block.timestamp + vestingCliff);

        console2.log("\npre stake \n");
        console2.log("\nalice:");
        _userInfo(alice);
        _userBalance(alice);
        console2.log("\nbob:");
        _userInfo(bob);
        _userBalance(bob);
        console2.log("\ncharlie:");
        _userInfo(charlie);
        _userBalance(charlie);


        console2.log("\nstake:");
        console2.log("\nalice:");
        console2.log("alice %s", alice);
        _stake(alice, 2);
        console2.log("\nbob:");
        _stake(bob, 4);
        console2.log("\ncharlie:");
        _stake(charlie, 1);

        console2.log("\npost stake \n");

        console2.log("\nalice:");
        _userInfo(alice);
        _userBalance(alice);
        console2.log("\nbob:");
        _userInfo(bob);
        _userBalance(bob);
        console2.log("\ncharlie:");
        _userInfo(charlie);
        _userBalance(charlie);
        console2.log("\n");

        console2.log("post stake claimable \n");
        console2.log("\nalice:");
        _userClaimable(alice);
        console2.log("\nbob:");
        _userClaimable(bob);
        console2.log("\ncharlie:");
        _userClaimable(charlie);

        vm.warp(block.timestamp + vestingPeriod/4);

        console2.log("\n-------post warp claimable \n");
        console2.log("\nalice:");
        _userClaimable(alice);
        console2.log("\nbob:");
        _userClaimable(bob);
        console2.log("\ncharlie:");
        _userClaimable(charlie);

        console2.log("\npool:");
        _balanceOfAssets(address(proxy));

        console2.log("\n------unstake \n");

        vm.startPrank(alice);
        proxy.unstakeAll();
        vm.stopPrank();

        vm.startPrank(bob);
        proxy.unstakeAll();
        vm.stopPrank();

        vm.startPrank(charlie);
        proxy.unstakeAll();
        vm.stopPrank();

        console2.log("\npost unstake \n");

        console2.log("\nalice:");
        _userInfo(alice);
        _userBalance(alice);
        console2.log("\nbob:");
        _userInfo(bob);
        _userBalance(bob);
        console2.log("\ncharlie:");
        _userInfo(charlie);
        _userBalance(charlie);
        console2.log("\n");

        console2.log("post unstake claimable \n");
        console2.log("\nalice:");
        _userClaimable(alice);
        console2.log("\nbob:");
        _userClaimable(bob);
        console2.log("\ncharlie:");
        _userClaimable(charlie);

        console2.log("\npool:");
        _balanceOfAssets(address(proxy));
        console2.log("\nalice:");
        _balanceOfAssets(alice);
        console2.log("\nbob:");
        _balanceOfAssets(bob);
        console2.log("\ncharlie:");
        _balanceOfAssets(charlie);
        // vm.warp(block.timestamp + vestingPeriod/4);

        // console2.log("post warp claimable \n");
        // console2.log("\nalice:");
        // _userClaimable(alice);
        // console2.log("\nbob:");
        // _userClaimable(bob);
        // console2.log("\ncharlie:");
        // _userClaimable(charlie);

        // console2.log("\npool:");
        // _balanceOfAssets(address(proxy));
        // console2.log("\nalice:");
        // _balanceOfAssets(alice);
        // console2.log("\nbob:");
        // _balanceOfAssets(bob);
        // console2.log("\ncharlie:");
        // _balanceOfAssets(charlie);
        // console2.log("test 3\n");
        // aliceVested = proxy.getClaimable(alice);
        // console2.log("alice vested %s %s", aliceVested[0], aliceVested[1]);
        // aliceBalance = proxy.balanceOf(alice);
        // console2.log("balance of alice post stake", aliceBalance);

        // console2.log("-------post stake----------");
        // console2.log(
        //     "coll balances token A %s B %s",
        //     tA.balanceOf(address(proxy)),
        //     tB.balanceOf(address(proxy)),
        //     tC.balanceOf(address(proxy))
        // );
        // console2.log(
        //     "alice balances token A %s B %s",
        //     tA.balanceOf(alice),
        //     tB.balanceOf(alice),
        //     tC.balanceOf(alice)
        // );

        // (
        //     depositedShare,
        //     rewardDebt
        // ) = proxy.userInfo(alice);
        // console2.log(
        //     "alice userInfo: depositedShare %s",
        //     depositedShare
        // );
        // console2.log(
        //     rewardDebt
        // );
        // vm.stopPrank();

        // console2.log("unstake alice \n");
        // vm.startPrank(alice);
        // //console2.log("stake more alice \n");
        // //proxy.stake(aliceBalance);
        // vm.warp(block.timestamp + vestingPeriod);
        // console2.log("post warp \n");
        // //proxy.unstakeAll();

        // console2.log("test 4\n");
        // aliceVested = proxy.getClaimable(alice);
        // console2.log("alice vested %s %s", aliceVested[0], aliceVested[1]);
        // aliceBalance = proxy.balanceOf(alice);
        // console2.log("balance of alice post stake", aliceBalance);

        // console2.log("-------post stake----------");
        // console2.log(
        //     "coll balances token A %s B %s",
        //     tA.balanceOf(address(proxy)),
        //     tB.balanceOf(address(proxy)),
        //     tC.balanceOf(address(proxy))
        // );
        // console2.log(
        //     "alice balances token A %s B %s",
        //     tA.balanceOf(alice),
        //     tB.balanceOf(alice),
        //     tC.balanceOf(alice)
        // );

        // (
        //     depositedShare,
        //     rewardDebt
        // ) = proxy.userInfo(alice);
        // console2.log(
        //     "alice userInfo: depositedShare %s",
        //     depositedShare
        // );
        // vm.stopPrank();
    }
}
