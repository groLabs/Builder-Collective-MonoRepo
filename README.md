##  BuidlCollective Smart Contract


### Deployment Instruction

1. Deploy The Implementation Contract `BuidlCollective.sol`

2. Deploy The Proxy Contract `proxy-factory.sol` by passing the address of the Implementation Contract in 1.) into the constructor


### To create a collective

1. In the proxy, call `createNewBuilder()`, by passing the following arguments:
```
string[] memory _namesOfParticipants,
        Collective memory _collectiveInfo,
        address[] memory _tokens,
        uint128[] memory _prices,
        address[] memory _users,
        uint256[] memory _targets
```

Except `_collectiveInfo`, which represents  `vestingTime`, `cliff` and `startTime` (which would be overrided in the execution with `block.timestamp`)  respectively, each of the remaining arugments is paired element-wise.

`_tokens: address of the vesting tokens`

`_prices: price of the vesting tokens`

`_users: sender of the vesting tokens`

`_targets: quantity of the vesting tokens`


### Participants Approve Their Token Offering

1. Before kick-starting the collective, all users specified in the start function would have to approve an allowance of their corresponding token with the minimum amount specified in `_targets`. 

2. If all users complete their approval, the `pokeApproval()` would return true for all.

```
pokeApproval()
```



### To Start a Collective 

1. To start the collective, the address that calls the createBuilder previously would have to call `startCollective()`

```
startCollective()
```

2. Alternatively, the deployer can call `setAdmin(address _newAdmin)` to trafer the admin right to a new address.
```
setAdmin(address _newAdmin)
```


Once The collective is started, all users would be minted thier share of the collective. This share is an ERC20 token which they can be transferred. 

The underlying tokens would then be released according to the vesting schedule which then can be claimed by staked share tokens. 

**To convert share tokens to their underlying tokens, the share token would have to be staked into the proxy.**
### To Stake

```
stake(uint256 _amount)
```

### To View Claimable

```
getClaimable(address _user)
```


### To Claim

```
claim()
```

### To Unstake

```
unstake(address _user) or

unstakeAll()
```

