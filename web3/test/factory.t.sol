// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import "forge-std/Test.sol";
import "forge-std/Vm.sol";
import "./utils/utils.sol";
import "../src/contracts/BuidlCollective.sol";
import "../src/contracts/proxy-factory/proxy-factory.sol";
import "../src/contracts/mocks/MockERC20.sol";
import "forge-std/console2.sol";


contract factoryTest is Test {
    using stdStorage for StdStorage;

	address constant BASED_ADDRESS = address(0xBA5EDF9dAd66D9D81341eEf8131160c439dbA91B);

    Utils internal utils;

    BuidlCollective BCP;
    BuidlerFactory bFactory;

    address payable[] internal users;
    address internal alice;
    address internal bob;
    address internal charlie;
    address internal mev;
    address internal torsten;

    function findStorage(address _user, bytes4 _selector, address _contract) public returns (uint256) {
        uint256 slot = stdstore
            .target(_contract)
            .sig(_selector)
            .with_key(_user)
            .find();
        bytes32 data = vm.load(_contract, bytes32(slot));
        return uint256(data);
    }

    function setStorage(address _user, bytes4 _selector, address _contract, uint256 value) public {
        uint256 slot = stdstore
            .target(_contract)
            .sig(_selector)
            .with_key(_user)
            .find();
        vm.store(_contract, bytes32(slot), bytes32(value));
    }

    function delta(uint256 a, uint256 b) internal pure returns (uint256) {
        return a > b
            ? a - b
            : b - a;
    }
    
    function createToken() public returns (address) {
        ERC20 token = new MockERC20('test token', 'tt', 18);
        return address(token);
    }

    function genToken(uint256 amount, address token, address _user) public {
        setStorage(_user, ERC20(token).balanceOf.selector, token, type(uint256).max);
    }

    function setUp() public {

        utils = new Utils();
        users = utils.createUsers(5);

        alice = users[0];
        vm.label(alice, "Alice");
        bob = users[1];
        vm.label(bob, "Bob");
        charlie = users[2];
        vm.label(charlie, "Charlie");
        mev = users[3];
        vm.label(mev, "Mev");
        torsten = users[4];
        vm.label(torsten, "Torsten");

        vm.startPrank(BASED_ADDRESS);
        BCP = new BuidlCollective('test pool', 'TP', 18);
        bFactory = new BuidlerFactory(address(BCP));
        BCP.updateAdmin(address(bFactory));
        vm.stopPrank();
    }

    struct Collective {
        uint32 vestingTime;
        uint32 cliff;
        uint32 collectiveStart;
    }

    function testDeployClone() public {
        vm.startPrank(alice);
        Collective memory colInfo = Collective(
            1000,
            100,
            0
        );
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

        bytes memory data = abi.encodeWithSignature("initialize(string[],(uint32,uint32,uint32),address[],uint128[],address[],uint256[])", names, colInfo, tokens, prices, participants, targets);
        address proxy = bFactory.createNewBuilder(data);
        console2.log('proxy %s %s', proxy, bFactory.proxies(0));
        
    }
}

