export const queryAllCollectives = (
    first: number,
    skip: number,
) => (
    `{
        _meta {
            hasIndexingErrors
            block {
                number
                timestamp
            }
        }
        collectives (
            first: ${first}
            skip: ${skip}
            orderBy: creation_date
            orderDirection: asc
        ) {
            address: id
            ownerAddress {
                id
            }
            started
            started_date
            cliff
            vesting_time
            creation_date
            participants (
                orderBy: index
                orderDirection: asc
            ) {
                index
                amount
                price
                name
                tokenAddress
                stakedAmount
                depositedShare
                lastCheckpointTWAP
                lastCheckpointTime
                lastCheckpointPercentageVested
                participantAddress {
                    id
                }
                participantClaims {
                    tokenAddress
                    claimAmount
                }
            }
        }
    }`
);

export const queryPersonalCollectives = (
    account: string,
    first: number,
    skip: number,
) => (
    `{
        _meta {
            hasIndexingErrors
            block {
              number
              timestamp
            }
        }
    }`
);
