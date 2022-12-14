pragma solidity ^0.8.11;

import "./Base.t.sol";
import {console} from "@forge-std/console.sol";
import {stdStorage, StdStorage, Test} from "@forge-std/Test.sol";
import {ERC20} from "@solmate/tokens/ERC20.sol";
import {BuidlCollective} from "../src/contracts/BuidlCollective.sol";
import {MockERC20} from "../src/contracts/mocks/MockERC20.sol";


contract BuidlCollectiveTest is BaseSetup {
    BuidlCollective internal bl;
    uint256 constant public VEST_MULTIPLIER = 10 ** 18;
    uint32 constant public BP = 10000;
    MockERC20 internal USDT;
    MockERC20 internal USDC;
    address user1 = 0xdAC17F958D2ee523a2206206994597C13D831ec7;
    address user2 = 0x359F4fe841f246a095a82cb26F5819E10a91fe0d;
    string user1_Name = "user1";
    string user2_Name = "user2";
    uint256 target1 = 1500 * 10 ** 18;
    uint256 target2 = 100 * 10 ** 18;
    uint8 decimal = 18;
    uint128 price1 = 100;
    uint128 price2 = 100;
    uint32 vestingPeriod = 60;
    uint32 cliff = 30;

    function setUp() public virtual override {
        bl = new BuidlCollective("MyName", "MySymbol", 18);
        vm.prank(user1);
        USDT = new MockERC20("USDT", "USDT", decimal);
        USDT.mint(user1, target1);
        vm.stopPrank();
        vm.prank(user2);
        USDC = new MockERC20("USDC", "USDC", decimal);
        USDC.mint(user2, target2);
        vm.stopPrank();
        initialize();
        approve();
        startCollective();
    }

    function testDecimals() public {
        uint8 d = bl.decimals();
        assertEq(d, 18);
    }

    function testName() public {
        string memory name = "MyName";
        assertEq(name, bl.name());
    }
    function initialize() public {
        // vestingPeriod, cliff, startTime, startTime would be updated anyway upon start;
        BuidlCollective.Collective memory _ci = BuidlCollective.Collective(vestingPeriod, uint32(cliff), uint32(0));
        address[] memory _tokens = new address[](2);
        uint128[] memory _prices = new uint128[](2);
        address[] memory _users = new address[](2);
        uint256[] memory _targets = new uint256[](2);
        string[] memory _userNames = new string[](2);
        _userNames[0] = user1_Name;
        _userNames[1] = user1_Name;
        _tokens[0] = address(USDT);
        _tokens[1] = address(USDC);
        _prices[0] = price1;
        _prices[1] = price2;
        _users[0] = user1;
        _users[1] = user2;
        _targets[0] = target1;
        _targets[1] = target2;
        vm.prank(address(this));
        bl.initialize(_userNames, _ci, _tokens, _prices, _users, _targets);
        assertEq(bl.tokens(0), address(USDT));
        assertEq(bl.tokens(1), address(USDC));
        }

    function mockUSDT() public {
        vm.prank(user1);            
        new MockERC20("USDT", "USDT", decimal);
        USDC.mint(user1, target1);
    }

    function mockUSDC() public {
        vm.prank(user2);
        new MockERC20("USDC", "USDC", decimal);
        USDT.mint(user2, target2);
    }

    function approve() public {
        vm.prank(user1);
        ERC20(USDT).approve(address(bl), target1);
        vm.stopPrank();
        vm.prank(user2);
        ERC20(USDC).approve(address(bl), target2);
        assertEq(bl.pokeApproval()[0], true);
        assertEq(bl.pokeApproval()[1], true);
        vm.stopPrank();
    }
        
    function startCollective() public {
        bl.startCollective();
        
        //assert funds are pulled
        assertEq(target1, ERC20(USDT).balanceOf(address(bl)));
        assertEq(target2, ERC20(USDC).balanceOf(address(bl)));
        // assert the shares for user1 and user2
        uint256 assetValue1 = price1 * target1;
        uint256 assetValue2 = price2 * target2;

        //assert totalShares;
        assertEq(assetValue1 + assetValue2, bl.totalAssets());
        //assert shares minted
        assertEq(assetValue1, bl.balanceOf(user1));
        assertEq(assetValue2, bl.balanceOf(user2));
    }
        
    function testStake() public {
        uint256 assetValue1 = price1 * target1;
        uint256 assetValue2 = price2 * target2;

        assertEq(assetValue1, bl.balanceOf(user1));
                
        vm.prank(user1);
        bl.stake(assetValue1);
        vm.prank(user2);
        bl.stake(assetValue2);
        vm.stopPrank();


        (uint256 depositedShare1,,,,) = bl.userInfo(user1);
        (uint256 depositedShare2,,,,) = bl.userInfo(user2);

        uint256 calculatedShare1 = (assetValue1 * VEST_MULTIPLIER * BP) / (assetValue1 + assetValue2);
        uint256 calculatedShare2 = (assetValue2 * VEST_MULTIPLIER * BP) / (assetValue1 + assetValue2);
        assertEq(depositedShare1, calculatedShare1);
        assertEq(depositedShare2, calculatedShare2);
    }

    function testDepositedShare() public {
        testStake();
        uint256 assetValue1 = price1 * target1;
        uint256 assetValue2 = price2 * target2;


        uint256 ratio1 = assetValue1 * BP * VEST_MULTIPLIER/ (assetValue1 + assetValue2);
        (uint256 depositedShare,,,,) = bl.userInfo(user1);

        assertEq(ratio1  , depositedShare);
        assertEq(bl.totalStaked(), assetValue1 + assetValue2);
    }

    function testUnstakeAll() public {
        testStake();
        uint256 assetValue1 = price1 * target1;
        uint256 assetValue2 = price2 * target2;
        uint256 calculatedShare1 = (assetValue1 * VEST_MULTIPLIER * BP) / (assetValue1 + assetValue2);
        uint256 calculatedShare2 = (assetValue2 * VEST_MULTIPLIER * BP) / (assetValue1 + assetValue2);
        vm.prank(user1);
        bl.unstakeAll();
        vm.prank(user2);
        bl.unstakeAll();
        vm.stopPrank();
        assertEq(bl.balanceOf(user1), assetValue1 );
        assertEq(bl.balanceOf(user2), assetValue2 );
        assertEq(bl.totalStaked(), 0);
    }

    function testUnstakeAfterVesting() public {
        testStake();
        vm.prank(user1);
        uint256 vestRatio = 5000;
        uint256 assetValue1 = price1 * target1;
        uint256 assetValue2 = price2 * target2;

        uint256 ratio1 = assetValue1 * VEST_MULTIPLIER / (assetValue1 + assetValue2);
        uint256 timeToSkip = cliff + vestRatio * vestingPeriod / BP;
        skip(timeToSkip);

        bl.unstakeAll();
        vm.stopPrank();
        // assert the unstake amount
        assertEq(bl.balanceOf(user1), assetValue1 * vestRatio / BP);
        assertEq(bl.totalStaked(), assetValue2);
    }

        function testGetVestingPercentage() public {
        uint256 vestRatio = 10000;

        uint256 timeToSkip = cliff+ vestRatio * vestingPeriod / BP;
        skip(timeToSkip);

        assertEq(bl.getVestingPercent(), vestRatio * VEST_MULTIPLIER);

        vestRatio = 11000;
        skip(cliff + vestRatio * vestingPeriod / BP);
        assertEq(bl.getVestingPercent(), BP * VEST_MULTIPLIER);
    }

    function testCalculateShareToClaim() public {
        testStake();
        uint256 vestRatio = 5000;
        uint256 assetValue1 = price1 * target1;
        uint256 assetValue2 = price2 * target2;

        uint256 ratio1 = assetValue1 * BP * VEST_MULTIPLIER / (assetValue1 + assetValue2);
        uint256 timeToSkip = cliff+ vestRatio * vestingPeriod / BP;
        skip(timeToSkip);
        assertEq(ratio1 * vestRatio / BP, bl.calculateShareToClaim(user1));

    }

    function testClaimAfterVesting() public {
        testStake();
        vm.prank(user1);
        uint256 vestRatio = 5000;
        uint256 assetValue1 = price1 * target1;
        uint256 assetValue2 = price2 * target2;
        uint256 ratio1 = assetValue1 * BP  * VEST_MULTIPLIER/ (assetValue1 + assetValue2);


        uint256 timeToSkip = cliff+ vestRatio * vestingPeriod / BP;
        skip(timeToSkip);

        bl.claim();
        // assert the unstake amount
        assertEq(ERC20(USDT).balanceOf(user1), ratio1 * vestRatio * target1 / BP / BP / VEST_MULTIPLIER);
        vm.stopPrank();
    }
    
    function testClaimableAfterVesting() public {
        testStake();
        vm.prank(user1);
        uint256 vestRatio = 5000;
        uint256 assetValue1 = price1 * target1;
        uint256 assetValue2 = price2 * target2;

        uint256 ratio1 = assetValue1 * BP * VEST_MULTIPLIER/ (assetValue1 + assetValue2);
        uint256 timeToSkip = cliff+ vestRatio * vestingPeriod / BP;
        skip(timeToSkip);

        vm.stopPrank();
        uint256[] memory _targets = new uint256[](2);
        _targets[0] = target1;
        _targets[1] = target2;
        uint256 target;

        uint256 length = bl.noOfTokens();
        uint256[] memory claimable = bl.getClaimable(user1);
        for(uint256 i = 0; i<length; i++) {
            target = _targets[i];
            assertEq(claimable[i], ratio1 * vestRatio * target / BP / BP / VEST_MULTIPLIER);
        }
    }

    function testVestingAfterFullyVested() public {
        skip(cliff + vestingPeriod);
        //stake post vesting completes
        testStake();
        uint256 assetValue1 = price1 * target1;
        uint256 assetValue2 = price2 * target2;
        uint256 ratio1 = assetValue1 * BP  * VEST_MULTIPLIER/ (assetValue1 + assetValue2);
        vm.prank(user1);
        bl.claim();
        // assert the unstake amount
        assertEq(ERC20(USDT).balanceOf(user1), ratio1 * target1 / BP / VEST_MULTIPLIER);
        vm.stopPrank();
    }

    function testClaimAfterOverVest() public {
        uint256 stakeRatio = 5000;
        uint256 vestRatio = 7000;
        uint256 assetValue1 = price1 * target1;
        uint256 assetValue2 = price2 * target2;
        uint256 ratio1 = assetValue1 * BP  * VEST_MULTIPLIER/ (assetValue1 + assetValue2);
        vm.prank(user1);
        bl.stake(assetValue1 * stakeRatio / BP);
        uint256 timeToSkip = cliff + vestingPeriod * vestRatio / BP;
        skip(timeToSkip);
        vm.prank(user1);
        bl.claim();
        vm.stopPrank();
        if (vestRatio > stakeRatio) {
            assertEq(ERC20(USDT).balanceOf(user1), ratio1 * stakeRatio * target1 / BP / BP / VEST_MULTIPLIER);
        } else {
            assertEq(ERC20(USDT).balanceOf(user1), ratio1 * vestRatio * target1 / BP / BP / VEST_MULTIPLIER);
        }
     }

     function testClaimAfterReStake() public {
        uint256 stakeRatio1 = 5000;
        uint256 stakeRatio2 = 2000;
        uint256 vestRatio = 7000;
        uint256 assetValue1 = price1 * target1;
        uint256 assetValue2 = price2 * target2;
        uint256 ratio1 = assetValue1 * BP  * VEST_MULTIPLIER/ (assetValue1 + assetValue2);
        vm.prank(user1);
        bl.stake(assetValue1 * stakeRatio1 / BP);
        uint256 timeToSkip = cliff + vestingPeriod * vestRatio / BP;
        skip(timeToSkip);
        vm.prank(user1);
        bl.stake(assetValue1 * stakeRatio2 / BP);
        vm.prank(user1);
        bl.claim();
        vm.stopPrank();
        assertEq(ERC20(USDT).balanceOf(user1), ratio1 * (stakeRatio1 + stakeRatio2) * target1 / BP / BP / VEST_MULTIPLIER);
     }
}

