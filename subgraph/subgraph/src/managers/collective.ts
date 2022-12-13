import { NUM } from '../utils/constants';
import { initUser } from '../setters/user';
import {
    initCollective,
    initCollectiveParticipant,
    initCollectiveParticipantClaim,
} from '../setters/collective';
import {
    BigInt,
    Address,
} from '@graphprotocol/graph-ts';
import {
    getBase,
    tokenToDecimal
} from '../utils/tokens';


export const manageNewCollective = (
    collectiveAddress: Address,
    ownerAddress: Address,
    creationDate: i32,
    names: string[],
    tokens: Address[],
    prices: BigInt[],
    users: Address[],
    amounts: BigInt[],
    cliff: i32,
    vestingTime: i32,
): void => {
    initUser(ownerAddress);
    initCollective(
        collectiveAddress,
        creationDate,
        ownerAddress,
        cliff,
        vestingTime
    );
    for (let i = 0; i < users.length; i++) {
        initUser(users[i]);
        const base = getBase(tokens[i]);
        const amount = tokenToDecimal(amounts[i], base, 7);
        initCollectiveParticipant(
            collectiveAddress,
            users[i],
            i,
            names[i],
            tokens[i],
            amount,
            prices[i].toBigDecimal(),
        );
        initCollectiveParticipantClaim(
            collectiveAddress,
            users[i],
            tokens[i],
            NUM.ZERO,
        );
    }
}