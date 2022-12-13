// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import "forge-std/Test.sol";
import "forge-std/Vm.sol";
import "./utils/utils.sol";
import "../src/contracts/mocks/MockERC20.sol";

contract BaseSetup is Test {
    using stdStorage for StdStorage;

    address constant BASED_ADDRESS =
        address(0xBA5EDF9dAd66D9D81341eEf8131160c439dbA91B);

    Utils internal utils;

    address payable[] internal users;
    address internal alice;
    address internal bob;
    address internal charlie;
    address internal mev;
    address internal torsten;

    struct Collective {
        uint32 vestingTime;
        uint32 cliff;
        uint32 collectiveStart;
    }

    function findStorage(
        address _user,
        bytes4 _selector,
        address _contract
    ) public returns (uint256) {
        uint256 slot = stdstore
            .target(_contract)
            .sig(_selector)
            .with_key(_user)
            .find();
        bytes32 data = vm.load(_contract, bytes32(slot));
        return uint256(data);
    }

    function setStorage(
        address _user,
        bytes4 _selector,
        address _contract,
        uint256 value
    ) public {
        uint256 slot = stdstore
            .target(_contract)
            .sig(_selector)
            .with_key(_user)
            .find();
        vm.store(_contract, bytes32(slot), bytes32(value));
    }

    function delta(uint256 a, uint256 b) internal pure returns (uint256) {
        return a > b ? a - b : b - a;
    }

    function createToken() public returns (address) {
        ERC20 token = new MockERC20("test token", "tt", 18);
        return address(token);
    }

    function genToken(uint256 amount, address token, address _user) public {
        setStorage(
            _user,
            ERC20(token).balanceOf.selector,
            token,
            type(uint256).max
        );
    }

    function mockToken(
        uint256 _amount,
        address _user,
        uint8 _decimals
    ) public returns (address) {
        vm.prank(_user);
        MockERC20 token = new MockERC20("test token", "tt", _decimals);
        token.mint(_user, _amount);
        vm.stopPrank();
        return address(token);
    }

    function setUp() public virtual {
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
    }
}
