import { Address } from "@graphprotocol/graph-ts";


// generates CollectiveParticipant ID
export const generateCpId = (
    collectiveAddress: Address,
    participantAddress: Address,
): string => {
    const id = collectiveAddress.toHexString()
        + '-' + participantAddress.toHexString();
    return id;
}

// generates CollectiveParticipantClaim ID
export const generateCpcId = (
    collectiveAddress: Address,
    participantAddress: Address,
    tokenAddress: Address,
): string => {
    const id = collectiveAddress.toHexString()
        + '-' + participantAddress.toHexString()
        + '-' + tokenAddress.toHexString();
    return id;
}
