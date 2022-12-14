pragma solidity ^0.8.0;

import "../interfaces/IBuidlCollective.sol";
import {ERC20} from "@solmate/tokens/ERC20.sol";

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
///     ###############################################
///
contract BuidlCollective is ERC20, IBuidlCollective {
    /*//////////////////////////////////////////////////////////////
                        CONSTANTS & IMMUTABLES
    //////////////////////////////////////////////////////////////*/
    uint32 public constant BP = 10000;
    uint256 public constant VEST_MULTIPLIER = 10 ** 18;

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
        // accumulated claimable
        uint256 accClaimable;
        // last TWAP during stake/unstake/claim
        uint256 lastCheckpointTWAP;
        // last timestamp during stake/unstake/claim
        uint256 lastCheckpointTime;
        // last percentageVested for the entire vestingSchedule during stake/unstake/claim
        uint256 lastCheckpointPercentageVested;
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

    /*//////////////////////////////////////////////////////////////
                    STAKING RELATED VARIABLES
    //////////////////////////////////////////////////////////////*/
    mapping(address => UserInfo) public userInfo;
    // timestamp for checkpointing
    uint256 public lastCheckpoint;
    // a checkpoint number based on percentageStaked(bp) * number of second passed
    uint256 public lastTWAP;
    // totalStaked of asset in absolute values
    uint256 public totalStaked;

    modifier onlyAdmin() {
        require(msg.sender == admin);
        _;
    }

    /// @notice update lastTWAP and lastCheckpoint.
    ///     this function is called during stake/claim/unstake
    modifier updateCheckpoint() {
        if (block.timestamp > lastCheckpoint) {
            lastTWAP +=
                (totalStaked * BP * (block.timestamp - lastCheckpoint)) /
                totalAssets;
            lastCheckpoint = block.timestamp;
            _;
        } else {
            _;
        }
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
    function updateAdmin(address _newAdmin) external onlyAdmin {
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
            require(tokenInfo[_tokens[i]].price == 0, "TOKEN ADDRESS ALREADY INITIALIZED");
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
            uint256 assetValue = (target * price * 10 ** 18) /
                10 ** ERC20(_tokens[i]).decimals();
            _totalAssets += assetValue;
            _mint(contributor, assetValue);
        }
        collectiveInfo.collectiveStart = uint32(block.timestamp);
        lastCheckpoint = collectiveInfo.collectiveStart + collectiveInfo.cliff;
        totalAssets = _totalAssets;
        emit LogNewPoolInitialized(block.timestamp);
    }

    ///  @notice admin function to cancel a collective, only before startCollective()
    ///  @param _to address to send back the eth during contract deployment
    function cancel(address payable _to) external onlyAdmin {
        require(collectiveStarted == false);
        selfdestruct(_to);
    }

    /*//////////////////////////////////////////////////////////////
                            VIEW LOGIC
    //////////////////////////////////////////////////////////////*/

    /// @notice function to read a defined tokens' address and specification in the collective
    /// @param  _tokenId position of the token during initialize()
    function readToken(
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
    /// @param  _staker address of staker
    /// @return the amounts of underlying tokens
    function getClaimable(address _staker) public view returns (uint256[] memory) {
        uint256 share = calculateShareToClaim(_staker);
        uint256[] memory _claimables = new uint256[](tokens.length);
        for (uint256 i = 0; i < tokens.length; i++) {
            _claimables[i] = convertShareToToken(share, i);
        }

        return _claimables;
    }

    /// @notice calculate the shares (in BPs) to claim for a particular user
    ///     updated = true means updateCheckpoint is run aldy, used in state transition function
    ///     updated = false means updateCheckpoint is not run, used in view function
    /// @param _staker address of the staker
    /// @return percentage of shares (in BPs)
    function calculateShareToClaim(
        address _staker
    ) public view returns (uint256) {
        uint256 currentVestingPercent = getVestingPercent();
        if (currentVestingPercent == BP * VEST_MULTIPLIER) {
            return userInfo[_staker].depositedShare;
        }
        if (block.timestamp <= userInfo[_staker].lastCheckpointTime) return userInfo[_staker].accClaimable;
        if (block.timestamp <= (collectiveInfo.collectiveStart + collectiveInfo.cliff)) return 0;
        // if vesting schedule completed, convert user's deposit using release factor
        // since every LP is backed by vested underlying tokens now
        uint256 elapsedVestingPercentage = currentVestingPercent -
            userInfo[_staker].lastCheckpointPercentageVested;
        
        uint256 elapsedTime = userInfo[_staker].lastCheckpointTime < (collectiveInfo.collectiveStart + collectiveInfo.cliff) 
        ?   
        block.timestamp -
        collectiveInfo.cliff -
        collectiveInfo.collectiveStart
        :
        block.timestamp -
        userInfo[_staker].lastCheckpointTime;    

        uint256 elapsedTWAP = lastCheckpoint < (collectiveInfo.collectiveStart + collectiveInfo.cliff)
        ?
        lastTWAP -
        userInfo[_staker].lastCheckpointTWAP +
        (totalStaked * BP * (block.timestamp - (collectiveInfo.collectiveStart + collectiveInfo.cliff))) /
        totalAssets
        :
        lastTWAP -
        userInfo[_staker].lastCheckpointTWAP +
        (totalStaked * BP * (block.timestamp - lastCheckpoint)) /
        totalAssets;

        uint256 avgPercentageStaked = elapsedTWAP / elapsedTime;

        if (avgPercentageStaked == 0) return 0;
        // user's percentage out of allStaked during the period
        uint256 userShareOfStaked = (userInfo[_staker].depositedShare * BP) /
            avgPercentageStaked;
        // user can get elapsedAmount
        uint256 userEntitlement = (elapsedVestingPercentage *
            userShareOfStaked) / BP / VEST_MULTIPLIER;

        return userEntitlement;
    }

    /// @notice helper function to calculate the percentage (in BPs) of share vested in the vesting schedule
    /// @return percentage of shares (in BPs) * VEST_MULTIPLIER
    function getVestingPercent() public view returns (uint256) {
        uint32 startTime = collectiveInfo.collectiveStart;
        if (startTime == 0) return 0;
        uint32 vestingTime = collectiveInfo.vestingTime;
        uint32 timePassed = uint32(block.timestamp) - startTime;
        if ((vestingTime + collectiveInfo.cliff) <= timePassed) return BP * VEST_MULTIPLIER;
        if (timePassed <= collectiveInfo.cliff) return 0;
        return VEST_MULTIPLIER * uint256(timePassed - collectiveInfo.cliff) * BP / uint256(vestingTime);
    }

    /// @notice helper function to calculate the amount of underlying tokens based on the percentage (in BPs) of share 
    /// @param  _share   percentage of shares (in BPs)
    /// @param  _tokenId position of the tokenId
    /// @return amount of a particular token
    function convertShareToToken(
        uint256 _share,
        uint256 _tokenId
    ) internal view returns (uint256) {
        require(_tokenId < tokens.length, "tokenId OUT OF BOUND");
        return
            (tokenInfo[tokens[_tokenId]].target * _share) / VEST_MULTIPLIER / BP;
    }

    /*//////////////////////////////////////////////////////////////
                        STAKE/CLAIM/UNSTAKE LOGIC
    //////////////////////////////////////////////////////////////*/

    /// @notice staking ERC20 representation tokens would slowly convert your representation tokens to the underlying tokens
    ///     if the vesting schedule has already started. 
    /// @param _assetValue the amount of ERC20 representation tokens to stake
    function stake(uint256 _assetValue) external updateCheckpoint {
        address from = msg.sender;
        address to = address(this);

        require(balanceOf[from] >= _assetValue, "USER BALANCE NOT ENOUGH");
        // Cannot overflow because the sum of all user
        // balances can't exceed the max uint256 value.
        unchecked {
            balanceOf[from] -= _assetValue;
            balanceOf[to] += _assetValue;
        }
        uint256 _lastCheckpointTWAP = lastTWAP;
        uint256 _lastCheckpointTime = block.timestamp;
        uint256 _lastCheckpointPercentageVested = getVestingPercent();
        uint256 _depositedShare = userInfo[msg.sender].depositedShare;
        uint256 _accClaimable = userInfo[msg.sender].accClaimable;
        if (_depositedShare == 0) {
            _depositedShare = (_assetValue * BP * VEST_MULTIPLIER) /
            totalAssets;
        } else {
            _accClaimable += calculateShareToClaim(msg.sender);
            _depositedShare += (_assetValue * BP * VEST_MULTIPLIER) /
            totalAssets;
        }
        UserInfo memory _stakePosition = UserInfo(
                _depositedShare,
                _accClaimable,
                _lastCheckpointTWAP,
                _lastCheckpointTime,
                _lastCheckpointPercentageVested
            );

        userInfo[msg.sender] = _stakePosition;
        totalStaked += _assetValue;
        emit Transfer(from, to, _assetValue);
        emit LogTokensStaked(
            msg.sender,
            _assetValue,
            _depositedShare,
            _lastCheckpointTWAP,
            _lastCheckpointTime,
            _lastCheckpointPercentageVested
        );
    }

    /// @notice unstake and withdraw the ERC20 representation tokens that are previously staked
    ///     without claiming, essentially forsaking the claimable
    /// @param _assetValueLeft the amount of ERC20 representation tokens to unstake
    /// @dev the unstake amount can be as big as the previously staked amount
    function unstakeWithoutClaim(uint256 _assetValueLeft) external {
        uint256 _unstakedShare = (_assetValueLeft * BP * VEST_MULTIPLIER) / totalAssets;
        require(
            _unstakedShare <= userInfo[msg.sender].depositedShare,
            "UNSTAKE AMOUNT TOO BIG"
        );
        totalStaked -= _assetValueLeft;
        userInfo[msg.sender].depositedShare -= _unstakedShare;
        ERC20(address(this)).transfer(msg.sender, _assetValueLeft);
        // since the user does not claim, the lastTWAP / checkpoint / lastCheckpointPercentageVested might be updated.
        emit LogTokensUnstaked(msg.sender, _assetValueLeft, _unstakedShare, lastTWAP, lastCheckpoint, userInfo[msg.sender].lastCheckpointPercentageVested);
    }
    
    /// @notice unstake and withdraw the ERC20 representation tokens that are previously staked
    ///     if any of them is not converted to underlying tokens.
    /// @param _assetValueLeft the amount of ERC20 representation tokens to unstake
    /// @dev the unstake amount should be the remainder of claimable since the function would call claim first.
    function unstake(uint256 _assetValueLeft) external updateCheckpoint {
        _claim(msg.sender);
        uint256 _unstakedShare = (_assetValueLeft * BP * VEST_MULTIPLIER) / totalAssets;
        require(
            _unstakedShare <= userInfo[msg.sender].depositedShare,
            "UNSTAKE AMOUNT TOO BIG"
        );
        totalStaked -= _assetValueLeft;
        userInfo[msg.sender].depositedShare -= _unstakedShare;
        ERC20(address(this)).transfer(msg.sender, _assetValueLeft);
        //user.lastCheckpointPercentageVested would be updated to latest, cheaper than re-calculating from getVestingPercent
        emit LogTokensUnstaked(msg.sender, _assetValueLeft, _unstakedShare, lastTWAP, lastCheckpoint, userInfo[msg.sender].lastCheckpointPercentageVested);
    }

    /// @notice unstake and withdraw ALL the ERC20 representation tokens that are previously staked
    ///     if any of them is not converted to underlying tokens.
    function unstakeAll() external updateCheckpoint {
        if (userInfo[msg.sender].depositedShare == 0) return;
        uint256 _prevShare = userInfo[msg.sender].depositedShare;
        uint256 _preAssetValue = (_prevShare *
            totalAssets) /
            VEST_MULTIPLIER /
            BP;
        _claim(msg.sender);
        uint256 assetValue = (userInfo[msg.sender].depositedShare *
            totalAssets) /
            VEST_MULTIPLIER /
            BP;
        totalStaked -= _preAssetValue;
        userInfo[msg.sender].depositedShare = 0;
        ERC20(address(this)).transfer(msg.sender, assetValue);
        emit LogTokensUnstaked(msg.sender, _preAssetValue, _prevShare, lastTWAP, lastCheckpoint, userInfo[msg.sender].lastCheckpointPercentageVested);
    }

    /// @notice claim would convert the ERC20 representation tokens into the underlying tokens based on the claimable quota.
    function claim() external updateCheckpoint returns (uint256 share) {
        uint256 share = _claim(msg.sender);
        return share;
    }

    /// @notice internal helper function to claim for a user
    function _claim(address _staker) internal returns (uint256 share) {
        uint256 share = calculateShareToClaim(_staker);
        address[] memory _tokens = tokens;
        uint256[] memory amounts = new uint256[](_tokens.length);
        uint256 userAccClaimable = userInfo[_staker].accClaimable;
        if ((share + userAccClaimable) > 0) {
            uint256 _userShare = userInfo[_staker].depositedShare;
            if (share >=  _userShare) {
                // share is enough to cover depositedShare
                userInfo[_staker].depositedShare = 0;
                userInfo[_staker].accClaimable += share - _userShare;
                share = _userShare;
            } else {
                // share not enough, need to consume userAccClaimable
                if (share + userAccClaimable > _userShare) {
                    userInfo[_staker].accClaimable -= _userShare - share;
                    share = _userShare;
                // consume both share and userAccClaimable
                } else {
                    userInfo[_staker].accClaimable = 0;
                    share += userAccClaimable;
                }
                userInfo[_staker].depositedShare -= share;
            }
            userInfo[_staker].lastCheckpointTWAP = lastTWAP;
            userInfo[_staker].lastCheckpointPercentageVested = getVestingPercent();
            userInfo[_staker].lastCheckpointTime = block.timestamp;
            uint256 shareToBurn = (share * totalAssets) / VEST_MULTIPLIER;
            uint256 assetValue = shareToBurn / BP;
            _burn(address(this), assetValue);
            for (uint256 i = 0; i < _tokens.length; i++) {
                uint256 amount = convertShareToToken(share, i);
                amounts[i] = amount;
                ERC20(_tokens[i]).transfer(_staker, amount);
            }
            emit LogTokensClaimed(_staker, share, _tokens, amounts);
            return share;
        }
    }
}
