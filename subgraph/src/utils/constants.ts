import {
    Bytes,
    Address,
    BigDecimal,
} from "@graphprotocol/graph-ts";
import {
    Num,
    Addr,
} from '../types/constants';

// Numbers
export const DECIMALS = 7;
export const NUM: Num = {
    ZERO: BigDecimal.fromString('0'),
    ONE: BigDecimal.fromString('1'),
    MINUS_ONE: BigDecimal.fromString('-1'),
}

// Default addresses
export const NO_ADDR = Bytes.empty();

// Contract addresses
export const ADDR: Addr = {
    ZERO: Address.fromString('0x0000000000000000000000000000000000000000'),
}
