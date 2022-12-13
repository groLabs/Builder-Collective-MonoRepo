import moment from 'moment';
import { Subgraph as sg } from '../types';
import { BigNumber as BN } from "bignumber.js";
import { SUBGRAPH_URL as URL } from '../constants';


export const getUrl = (subgraph: sg) => {
    switch (subgraph) {
        case sg.PROD_HOSTED:
            return URL.PROD_HOSTED;
        case sg.PROD_STUDIO:
            return URL.PROD_STUDIO;
        case sg.TEST_HOSTED:
            return URL.TEST_HOSTED;
        case sg.PROD_AWS:
            return URL.PROD_AWS;
        default:
            return URL.UNKNOWN;
    }
}

// @dev: some values from graphql output come as type <any> although they are string
export const toStr = (value: number): string => {
    return (typeof value === 'string')
        ? parseFloat(value).toFixed(7).toString()
        : value.toFixed(7).toString();
}

export const now = (): string => {
    return moment().unix().toString();
}

export const bnToDecimal = (
    amount: BN,
    precision: number,
    decimals: number,
): number => {
    const scale = BN(10).pow(precision);
    const result = BN(amount).div(scale).toFixed(decimals);
    return parseFloat(result);
}
