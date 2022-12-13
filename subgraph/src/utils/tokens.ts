import {
    log,
    BigInt,
    Address,
    BigDecimal,
} from '@graphprotocol/graph-ts';
import { ERC20 } from '../../generated/templates/BuidlCollective/ERC20';

// Converts a BigInt into a N-decimal BigDecimal
export function tokenToDecimal(
    amount: BigInt,
    precision: i32,
    decimals: i32,
): BigDecimal {
    const scale = BigInt.fromI32(10)
        .pow(precision as u8)
        .toBigDecimal();
    return amount.toBigDecimal()
        .div(scale)
        .truncate(decimals);
}

// Get base decimals depending on token contract
export const getBase = (
    tokenAddress: Address
): i32 => {
    const contract = ERC20.bind(tokenAddress);
    const decimals = contract.try_decimals();
    if (decimals.reverted) {
        log.error(
            'Error in src->utils->tokens->getBase(): decimals reverted on token address {}'
            , [tokenAddress.toHexString()]
        );
        return i32(0);
    } else {
        return i32(decimals.value);
    }
}
