import { initUser } from './user';
import { NUM } from '../utils/constants';
import {
    getBase,
    tokenToDecimal
} from '../utils/tokens';
import {
    generateCpId,
    generateCpcId,
} from '../utils/collectives';
import {
    log,
    BigInt,
    Address,
    BigDecimal,
} from '@graphprotocol/graph-ts';
import {
    Collective,
    CollectiveParticipant,
    CollectiveParticipantClaim,
} from '../../generated/schema';


export const setNewAdmin = (
    collectiveAddress: Address,
    adminAddress: Address
): void => {
    const id = collectiveAddress.toHexString();
    let col = Collective.load(id);
    if (col) {
        col.ownerAddress = adminAddress.toHexString();
        col.save();
    }
}

export const initCollective = (
    collectiveAddress: Address,
    creationDate: i32,
    ownerAddress: Address,
    cliff: i32,
    vestingTime: i32,
): Collective => {
    const id = collectiveAddress.toHexString();
    let col = Collective.load(id);
    if (!col) {
        col = new Collective(id);
        col.ownerAddress = ownerAddress.toHexString();
        col.creation_date = creationDate;
        col.cliff = cliff;
        col.vesting_time = vestingTime;
        col.started = false;
        col.started_date = 0;
        col.save();
    }
    log.info(
        '*** initCollective -> collectiveAddress: {} ownerAddress: {}',
        [
            collectiveAddress.toHexString(),
            ownerAddress.toHexString(),
        ]
    );
    return col;
}

export const setPoolInitialized = (
    collectiveAddress: Address,
    startDate: i32,
): void => {
    const id = collectiveAddress.toHexString();
    let col = Collective.load(id);
    if (col) {
        col.started = true;
        col.started_date = startDate;
        col.save();
    }
}

export const initCollectiveParticipant = (
    collectiveAddress: Address,
    participantAddress: Address,
    index: i32,
    name: string,
    tokenAddress: Address,
    amount: BigDecimal,
    price: BigDecimal
): CollectiveParticipant => {
    const id = generateCpId(
        collectiveAddress,
        participantAddress,
    );
    let cp = CollectiveParticipant.load(id);
    if (!cp) {
        cp = new CollectiveParticipant(id);
        cp.collectiveAddress = collectiveAddress.toHexString();
        cp.participantAddress = participantAddress.toHexString();
        cp.index = index;
        cp.name = name;
        cp.tokenAddress = tokenAddress;
        cp.amount = amount;
        cp.price = price;
        cp.stakedAmount = NUM.ZERO;
        cp.depositedShare = NUM.ZERO;
        cp.lastCheckpointTWAP = 0;
        cp.lastCheckpointTime = 0;
        cp.lastCheckpointPercentageVested = NUM.ZERO;
        cp.save();
    }
    return cp;
}

export const initCollectiveParticipantClaim = (
    collectiveAddress: Address,
    participantAddress: Address,
    tokenAddress: Address,
    claimAmount: BigDecimal,
): CollectiveParticipantClaim => {
    const id = generateCpcId(
        collectiveAddress,
        participantAddress,
        tokenAddress,
    );
    let cpc = CollectiveParticipantClaim.load(id);
    if (!cpc) {
        cpc = new CollectiveParticipantClaim(id);
        cpc.collectiveParticipant = collectiveAddress.toHexString()
            + '-' + participantAddress.toHexString();
        cpc.claimAmount = claimAmount;
        cpc.tokenAddress = tokenAddress;
        cpc.save();
    }
    return cpc;
}

export const setTokensStakedOrUnstaked = (
    collectiveAddress: Address,
    participantAddress: Address,
    amount: BigDecimal,
    side: string,
    depositedShare: BigDecimal,
    lastCheckpointTWAP: i32,
    lastCheckpointTime: i32,
    lastCheckpointPercentageVested: BigDecimal,
): void => {
    const id = generateCpId(
        collectiveAddress,
        participantAddress,
    );
    let cp = CollectiveParticipant.load(id);
    let msg = '*** setTokensStakedOrUnstaked -> amount: {} depositedShare: {} lastCheckpointTWAP: {}';
    msg += ' lastCheckpointTime: {} lastCheckpointPercentageVested: {} side: {} id: {}'
    log.info(
        msg,
        [
            amount.toString(),
            depositedShare.toString(),
            lastCheckpointTWAP.toString(),
            lastCheckpointTime.toString(),
            lastCheckpointPercentageVested.toString(),
            side,
            id,
        ]
    );
    if (cp) {
        if (side == 'staked') {
            cp.stakedAmount = cp.stakedAmount.plus(amount);
            cp.depositedShare = cp.depositedShare;
            cp.lastCheckpointTWAP = lastCheckpointTWAP;
            cp.lastCheckpointTime = lastCheckpointTime;
            cp.lastCheckpointPercentageVested = lastCheckpointPercentageVested;
        } else if (side == 'unstaked') {
            cp.stakedAmount = cp.stakedAmount.minus(amount);
            cp.depositedShare = cp.depositedShare;
            cp.lastCheckpointTWAP = lastCheckpointTWAP;
            cp.lastCheckpointTime = lastCheckpointTime;
            cp.lastCheckpointPercentageVested = lastCheckpointPercentageVested;
        }
        cp.save();
    }
}

export const setTokensClaimed = (
    collectiveAddress: Address,
    participantAddress: Address,
    tokens: Address[],
    claims: BigInt[],
    depositedShare: BigDecimal,
): void => {
    const idCp = generateCpId(
        collectiveAddress,
        participantAddress,
    );
    const _tokens = tokens.map<string>((token: Address) => token.toHexString());
    const _claims = claims.map<string>((claim: BigInt) => claim.toString());
    let msg = '*** setTokensClaimed -> collectiveAddress {} participantAddress {} ';
    msg += 'depositedShare {} tokens {} claims {}'
    log.info(
        msg,
        [
            collectiveAddress.toHexString(),
            participantAddress.toHexString(),
            depositedShare.toString(),
            _tokens.toString(),
            _claims.toString(),
        ]
    );
    let cp = CollectiveParticipant.load(idCp);
    if (cp) {
        cp.depositedShare = depositedShare;
        cp.save();
    }
    for (let i = 0; i < tokens.length; i++) {
        const idCpc = generateCpcId(
            collectiveAddress,
            participantAddress,
            tokens[i],
        );
        const base = getBase(tokens[i]);
        const claim = tokenToDecimal(claims[i], base, 7);
        let cpc = CollectiveParticipantClaim.load(idCpc);
        if (!cpc) {
            cpc = new CollectiveParticipantClaim(idCpc);
            cpc.collectiveParticipant = idCp;
            cpc.tokenAddress = tokens[i];
            cpc.claimAmount = NUM.ZERO;
        }
        cpc.claimAmount = cpc.claimAmount.plus(claim);
        cpc.save();
    }
}
