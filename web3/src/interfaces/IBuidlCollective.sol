interface IBuidlCollective {    
    // Initialize
    event LogNewCollectiveInitialized(string[] namesOfParticipants, address[] tokens, uint128[] price, address[] users, uint256[] targets, uint32 cliff, uint32 vestingTime);
    event LogNewPoolInitialized(uint256 time);

    event LogTokensClaimed(address user, uint256 share, address[] tokens, uint256[] amounts);

    event LogTokensUnstaked(address user, uint256 _assetValue, uint256 _unstakedShare, uint256 _lastCheckpointTWAP, uint256 _lastCheckpointTime, uint256 _lastCheckpointPercentageVested);
    event LogTokensStaked(address user, uint256 _assetValue, uint256 _depositedShare, uint256 _lastCheckpointTWAP, uint256 _lastCheckpointTime, uint256 _lastCheckpointPercentageVested);

    // priviledge
    event LogNewAdmin(address newAdmin);
}
