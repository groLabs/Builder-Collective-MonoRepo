pragma solidity ^0.8.0;

import "../interfaces/IBuidlCollective.sol";
import {ERC20} from "@solmate/tokens/ERC20.sol";
import "forge-std/console2.sol";

//  ________  ________  ________
//  |\   ____\|\   __  \|\   __  \
//  \ \  \___|\ \  \|\  \ \  \|\  \
//   \ \  \  __\ \   _  _\ \  \\\  \
//    \ \  \|\  \ \  \\  \\ \  \\\  \
//     \ \_______\ \__\\ _\\ \_______\
//      \|_______|\|__|\|__|\|_______|

/// @title BuidlCollective
/// @notice Create a uniform vesting schedule for multiple underlying tokens, which can be redeemed gradually through staking the ERC20 representation LP token.
///     ###############################################
///     BuidlCollective Specification
///     The BuidlCollective provides a way for co-vesting to be implemented on the block chain,
///         allowing multiple parties who seek to co-vest their tokens to initialize a collective,
///         providing approval for their corresponding liquid tokens, and start the vesting sychronously.
///         After the covesting is started, underlying tokens would be released according to the schedule and
///         be allocated to the staked ERC20 representation LP proportionally. Each LP tokens are guarantteed the
///         same amount of underlying tokens.
///     LP tokens can be freely transferred but would need to undergo staking in order to convert to the underlying tokens.
///     If 100% of representation LP tokens are staked, then the staked LP tokens are converted to underlying tokens
///     just like the vesting schedule
///     If 50% of representation LP tokens are staked, then the staked LP tokens are converted to underlying tokens
///     with half of the vesting time needed.
///
///     There is a 3-day releaseFactor that adjusts the rate staking position can claim their underlying tokens.
///     If a staked position can convert LP to 1% of the underlying tokens by staking 5 days. Since 5 days is more
///     than the releaseFactor (3-day), 1% full amount is converted.
///     If a staked position can convert LP to 1% of the underlying tokens by staking 1.5 days. Since 1.5 days is less
///     than the releaseFactor (3-day), pro-rated amount is converted, in this case, 1.5/3 * 1% = 0.5% is converted.
///     ###############################################
///
contract BuidlCollective is ERC20, IBuidlCollective {
    /*//////////////////////////////////////////////////////////////
                        CONSTANTS & IMMUTABLES
    //////////////////////////////////////////////////////////////*/
    uint32 public constant BP = 10000;
    uint32 public constant PRICE_FACTOR = 1E8;
    uint256 public constant REWARD_PRECISION = 1E12;

    /*//////////////////////////////////////////////////////////////
                            STRUCT
    //////////////////////////////////////////////////////////////*/
    struct Collective {
        // the period of vesting (in second)
        uint32 vestingTime;
        // the added time (in second) upon startCollective() before vesting begins
        uint32 cliff;
        // variable to log the startTime, would log the block.timestamp during startCollective()
        uint32 collectiveStart;
    }

    struct TokenInfo {
        // target quantity of the token
        uint256 target;
        // target price of the token
        uint128 price;
        // user who would provide approval of pulling fund from, would also receive the representation tokens for redeem
        address user;
    }

    struct UserInfo {
        // percentage(bp) multiplied by VEST_MULTIPLIER
        uint256 depositedShare;
        uint256 rewardDebt;
    }

    /*//////////////////////////////////////////////////////////////
            COLLECTIVE INITIALIZATION RELATED VARIABLES
    //////////////////////////////////////////////////////////////*/

    bool collectiveStarted;
    bool collectiveInitialized;

    address public admin;

    string[] public namesOfParticipants;
    uint256 public noOfTokens;
    address[] public tokens;

    mapping(address => TokenInfo) public tokenInfo;
    uint256 public totalAssets;
    Collective public collectiveInfo;

    uint256 freeRewards;
    uint256 totalClaimedRewards;
    uint256 lastCheckpoint;

    /*//////////////////////////////////////////////////////////////
                    STAKING RELATED VARIABLES
    //////////////////////////////////////////////////////////////*/

    // to adjust rate of claimable get released to staker
    uint256 public constant releaseFactor = 86400 * 3;

    mapping(address => UserInfo) public userInfo;
    uint256 public totalStaked;

    modifier onlyAdmin() {
        require(msg.sender == admin);
        _;
    }

    constructor(
        string memory _name,
        string memory _symbol,
        uint8 _decimals
    ) ERC20(_name, _symbol, _decimals) {
        admin = msg.sender;
        emit LogNewAdmin(admin);
    }

    /*//////////////////////////////////////////////////////////////
                            SETTERS
    //////////////////////////////////////////////////////////////*/

    ///  @notice admin function to transfer admin ownership
    ///  @param _newAdmin address of new admin
    function setAdmin(address _newAdmin) external onlyAdmin {
        admin = _newAdmin;
        emit LogNewAdmin(_newAdmin);
    }

    /*//////////////////////////////////////////////////////////////
                            CLONE & COLLECTIVE 
    //////////////////////////////////////////////////////////////*/
    ///  @notice admin function to initialize a collective
    ///  this version assumes 1 tokens are sent in by 1 address
    ///  @param _namesOfParticipants name of participants
    ///  @param _collectiveInfo defines vestingPeriod and cliff, startTime would be override in startCollective()
    ///  @param _tokens name of participants
    ///  @param _prices price of each tokens, would be used for calculating shares with _targets
    ///  @param _users address of users to pull funds during startCollective()
    ///  @param _targets tokens amounts
    function initialize(
        string[] memory _namesOfParticipants,
        Collective memory _collectiveInfo,
        address[] memory _tokens,
        uint128[] memory _prices,
        address[] memory _users,
        uint256[] memory _targets
    ) external {
        require(collectiveInitialized == false);
        collectiveInitialized = true;
        admin = msg.sender;
        collectiveInfo = _collectiveInfo;
        collectiveInfo.collectiveStart = 0;
        uint256 tokenLength = _tokens.length;
        for (uint256 i = 0; i < tokenLength; i++) {
            require(
                tokenInfo[_tokens[i]].price == 0,
                "TOKEN ADDRESS ALREADY INITIALIZED"
            );
            namesOfParticipants.push(_namesOfParticipants[i]);
            TokenInfo memory t = TokenInfo(_targets[i], _prices[i], _users[i]);
            tokenInfo[_tokens[i]] = t;
            tokens.push(_tokens[i]);
        }
        noOfTokens = tokenLength;

        emit LogNewCollectiveInitialized(
            _namesOfParticipants,
            _tokens,
            _prices,
            _users,
            _targets,
            collectiveInfo.cliff,
            collectiveInfo.vestingTime
        );
    }

    ///  @notice admin function to start the collective
    ///     during starting the contract would pull the predefined quantities of tokens
    ///     from the users defined in initialize()
    ///     any user defined in the initialize() that has not done approve in advance for their tokens
    ///     would lead to failure of this function
    function startCollective() external onlyAdmin {
        console2.log("startCollective %s", address(this));
        require(collectiveStarted == false);
        collectiveStarted = true;
        address[] memory _tokens = tokens;
        TokenInfo memory _tokenInfo;
        uint256 _totalAssets;
        for (uint256 i; i < _tokens.length; i++) {
            _tokenInfo = tokenInfo[_tokens[i]];
            uint256 target = _tokenInfo.target;
            address contributor = _tokenInfo.user;
            uint128 price = _tokenInfo.price;
            ERC20(_tokens[i]).transferFrom(contributor, address(this), target);
            uint256 assetValue = (target * price * (10 ** decimals)) /
                (10 ** ERC20(_tokens[i]).decimals() * PRICE_FACTOR);
            _totalAssets += assetValue;
            _mint(contributor, assetValue);
            console2.log("userName", namesOfParticipants[i]);
            console2.log("assetValue", assetValue);
            console2.log("balanceOf this", ERC20(_tokens[i]).balanceOf(address(this)));
            console2.log("balanceOf user", balanceOf[contributor]);
            console2.log("contributor address", contributor);
        }
        collectiveInfo.collectiveStart = uint32(block.timestamp);
        lastCheckpoint = block.timestamp + collectiveInfo.cliff;
        totalAssets = _totalAssets;
        emit LogNewPoolInitialized(block.timestamp);
    }

    ///  @notice admin function to cancel a collective, only before startCollective()
    ///  @param _to address to send back the eth during contract deployment
    function cancel(address payable _to) external onlyAdmin {
        require(collectiveStarted == false);
        selfdestruct(_to);
    }


    function _calcRewards() internal view returns (uint256) {
        uint256 _lastCheckpoint = lastCheckpoint;
        uint256 _freeRewards = freeRewards;
        if (block.timestamp <= _lastCheckpoint) {
            return freeRewards;
        }
        uint256 _vestingTime = collectiveInfo.vestingTime;
        uint256 timePassed;
        console2.log("\n------------calcRewards");
        console2.log("collectiveStart %s _vestingTime %s combined %s", collectiveInfo.collectiveStart, _vestingTime, collectiveInfo.collectiveStart + _vestingTime);
        console2.log("block.timestamp %s _lastCheckpoint %s", block.timestamp, _lastCheckpoint);
        if (block.timestamp > collectiveInfo.collectiveStart + _vestingTime) {
            _freeRewards = totalAssets;
        } else {
            timePassed = block.timestamp - _lastCheckpoint;
            console2.log("timePassed %s _vestingTime %s", timePassed, _vestingTime);
            if (timePassed > 0) {
                _freeRewards = (totalAssets * timePassed) /
                    _vestingTime;
            }
        }
        return _freeRewards;
    }

    function updatePool() internal returns (uint256) {
        console2.log("\n-------------updatePool");
        uint256 _freeRewards = _calcRewards();
        freeRewards = _freeRewards;
        lastCheckpoint = block.timestamp;
        // emit LogNewPoolUpdated(_freeRewards, block.timestamp);
        return _freeRewards;
    }

    /*//////////////////////////////////////////////////////////////
                            VIEWS 
    //////////////////////////////////////////////////////////////*/

    /// @notice function to read a defined tokens' address and specification in the collective
    /// @param  _tokenId position of the token during initialize()
    function getTokenInfo(
        uint256 _tokenId
    ) public view returns (address, TokenInfo memory) {
        address tokenAddr = tokens[_tokenId];
        return (tokenAddr, tokenInfo[tokenAddr]);
    }

    /// @notice only when all tokens involved return true can the admin start the collective
    /// @return return if tokens approval is completed for each tokens involved
    function pokeApproval() public view returns (bool[] memory) {
        bool[] memory approvals = new bool[](tokens.length);
        address contributor;
        uint256 allowance;
        for (uint256 i; i < tokens.length; i++) {
            contributor = tokenInfo[tokens[i]].user;
            allowance = ERC20(tokens[i]).allowance(contributor, address(this));
            if (allowance >= tokenInfo[tokens[i]].target) {
                approvals[i] = true;
            } else {
                approvals[i] = false;
            }
        }
        return approvals;
    }

    /// @notice function to read a staker's claimable
    /// @param  _user address of staker
    /// @return the amounts of underlying tokens
    function getClaimable(
        address _user
    ) external view returns (uint256[] memory) {
        console2.log("-------getClaimable-------");
        uint256 _lastCheckpoint = lastCheckpoint;
        uint256[] memory claimables = new uint256[](tokens.length);
        console2.log('block %s checkpoint %s', block.timestamp, _lastCheckpoint);

        uint256 _totalStaked = totalStaked;
        if (_totalStaked == 0) {
            return claimables;
        }

        uint256 _vestingTime = collectiveInfo.vestingTime;

        UserInfo storage _userInfo = userInfo[_user];

        if (block.timestamp < _lastCheckpoint) {
            return claimables;
        }
        uint256 _freeRewards = _calcRewards();

        console2.log(
            "depositedShare %s freeRewards %s totalAssets %s",
            _userInfo.depositedShare,
            _freeRewards,
            totalAssets
        );

        console2.log(
            "totalStaked %s",
            totalStaked
        );

        uint256 userPercents = 
            (_userInfo.depositedShare * 10000) /
            _totalStaked;

        uint256 userShare = (userPercents * _freeRewards * 1E18) /
            (totalAssets);

        console2.log(
            "userShare %s rewardDebt %s",
            userShare,
            _userInfo.rewardDebt 
        );

        if (_userInfo.rewardDebt > userShare) {
            return claimables;
        }

        uint256 pending = userShare - _userInfo.rewardDebt;

        console2.log("userShare %s pending %s", userShare, pending);

        uint256 _amount = pending / tokens.length;
        for (uint256 i; i < tokens.length; i++) {
            address _token = tokens[i];
            console2.log(
                "totalAssets %s, amount %s",
                totalAssets,
                _amount
            );
            console2.log(
                "claiming %s %s",
                i,
                (_amount * 10 ** ERC20(_token).decimals()) /
                    (10 ** decimals)
            );
            claimables[i] = 
                (_amount * 10 ** ERC20(_token).decimals()) /
                (10 ** decimals);
        }
        return claimables;
    }

    /*//////////////////////////////////////////////////////////////
                        STAKE/CLAIM/UNSTAKE LOGIC
    //////////////////////////////////////////////////////////////*/

    /// @notice staking ERC20 representation tokens would slowly convert your representation tokens to the underlying tokens
    ///     if the vesting schedule has already started.
    /// @param _amount the amount of ERC20 representation tokens to stake
    function stake(uint256 _amount) external {
        console2.log("balance %s amount %s sender %s", balanceOf[msg.sender], _amount, msg.sender);
        require(_amount <= balanceOf[msg.sender], 'not enough assets');

        UserInfo storage _userInfo = userInfo[msg.sender];
        balanceOf[msg.sender] -= _amount;

        uint256 _freeRewards = updatePool();

        _userInfo.depositedShare += _amount;
        //_userInfo.rewardDebt += _amount;
        console2.log("staking");
        totalStaked += _amount;
        console2.log(
            "user: deposit %s debt %s",
            _userInfo.depositedShare,
            uint256(_userInfo.rewardDebt)
        );
        console2.log(
            "system: totalStaked %s", 
            totalStaked
        );

        //emit logStake(msg.sender, _amount);
    }

    /// @notice unstake and withdraw the ERC20 representation tokens that are previously staked
    ///     without claiming, essentially forsaking the claimable
    /// @param _assetValueLeft the amount of ERC20 representation tokens to unstake
    /// @dev the unstake amount can be as big as the previously staked amount
    function unstakeWithoutClaim(uint256 _assetValueLeft) external {}

    /// @notice unstake and withdraw the ERC20 representation tokens that are previously staked
    ///     if any of them is not converted to underlying tokens.
    /// @param _amount the amount of ERC20 representation tokens to unstake
    /// @dev the unstake amount should be the remainder of claimable since the function would call claim first.
    function unstake(uint256 _amount) external {
        UserInfo storage _userInfo = userInfo[msg.sender];
        uint256 depositedShares = _userInfo.depositedShare;
        if (_amount > depositedShares) return;

        uint256 _freeRewards = updatePool();

        uint256 shares = _claim(_freeRewards);
        if (depositedShares - shares < _amount) {
            _amount = depositedShares - shares;
        }
        _userInfo.depositedShare -= (_amount + shares);
        _userInfo.rewardDebt += shares;
        balanceOf[msg.sender] += _amount;
        totalStaked -= (_amount + shares);
        totalSupply -= shares;

        //emit logUnstake(msg.sender, _amount);
    }

    /// @notice unstake and withdraw ALL the ERC20 representation tokens that are previously staked
    ///     if any of them is not converted to underlying tokens.
    function unstakeAll() external {
        console2.log("\n--------unstakeAll");
        UserInfo storage _userInfo = userInfo[msg.sender];
        uint256 _amount = _userInfo.depositedShare;
        uint256 _freeRewards = updatePool();
        console2.log("amount %s _freeRewards", _amount, _freeRewards);
        uint256 shares = _claim(_freeRewards);
        console2.log("shares %s", shares);

        _userInfo.depositedShare = 0;
        _userInfo.rewardDebt += shares;
        balanceOf[msg.sender] += (_amount - shares);
        totalStaked -= _amount;
        totalSupply -= shares;
        totalClaimedRewards += shares;

        //emit logUnstake(msg.sender, _amount);
    }

    function _claim(uint256 _freeRewards) public returns (uint256) {

        console2.log('\n-----------_claim');
        UserInfo storage _userInfo = userInfo[msg.sender];

        console2.log(
            "user: deposit %s debt %s",
            _userInfo.depositedShare,
            _userInfo.rewardDebt
        );

        console2.log(
            "totalAssets %s totalStaked %s",
            totalAssets,
            totalStaked
        );

        uint256 userPercents = 
            (_userInfo.depositedShare * 10000) /
            totalStaked;

        uint256 userShare = (userPercents * _freeRewards * 1E18) /
            (totalAssets);

        console2.log(
            "userShare %s userPercent %s",
            userShare,
            userPercents
        );

        if (_userInfo.rewardDebt > userShare) {
            return 0;
        }

        uint256 pending = userShare - _userInfo.rewardDebt;
        console2.log("userShare %s pending %s", userShare, pending);

        if (pending > 0) {
            console2.log(
                "pending %s userShare %s",
                pending,
                userShare
            );
            if (pending > userShare) {
                pending = userShare;
                _userInfo.depositedShare = 0;
            } else {
                _userInfo.depositedShare -= pending;
            }
            console2.log(
                "pending %s userShare %s",
                pending,
                userShare
            );
            uint256[] memory claimables = _claimRewards(pending);
            //emit logClaim(msg.sender, pending);
        }
        return pending;
    }

    /// @notice claim would convert the ERC20 representation tokens into the underlying tokens based on the claimable quota.
    function claim() external returns (uint256) {
        uint256 _freeRewards = updatePool();
        uint256 shares = _claim(_freeRewards);
        return shares;
    }

    /// @notice internal helper function to claim for a user
    function _claimRewards(uint256 _amount) private returns (uint256[] memory) {
        console2.log("claiming rewards");
        uint256[] memory claimables = new uint256[](tokens.length);
        uint256 _amount = _amount / tokens.length;
        uint256 claims;
        for (uint256 i; i < tokens.length; i++) {
            address _token = tokens[i];
            console2.log(
                "totalAssets %s, amount %s",
                totalAssets,
                _amount
            );
            console2.log(
                "claiming %s %s",
                i,
                (_amount * 10 ** ERC20(_token).decimals()) /
                    (10 ** decimals)
            );
            claims =
                (_amount * 10 ** ERC20(_token).decimals()) /
                (10 ** decimals);
            claimables[i] = claims;
            ERC20(_token).transfer(msg.sender, claims);
        }
        return claimables;
    }
}
