import { Token } from './types';


export const NA = 'N/A';
export const PORT = 3016;
export const TX_ITERATION = 850; // # of records retrieved per subgraph call (limited to 1000 per call)
export const MAX_VEST_TIME = 31556952;
export const LAUNCH_TIMESTAMP_ETH = '1622204347';
export const LAUNCH_TIMESTAMP_AVAX = '1638483222';
export const TS_1D = 86400;             // One day
export const TS_7D = 604800;            // Seven days
export const TS_15D = 1296000;          // Fifteen days
export const DECIMALS = 7;
export const BLOCKS_PER_YEAR = 2252571;
export const PWRD_TVL_CORRECTION = 432.5559;  // correction due to rebasing (as of Nov'22)
export const STABLECOINS = [
    Token.DAI,
    Token.USDC,
    Token.USDT,
    Token.TUSD,
    Token.FRAX,
    Token.OUSD,
    Token.ALUSD,
    Token.GUSD,
];

export const SUBGRAPH_URL = {
    PROD_HOSTED: {
        ETH: 'https://api.thegraph.com/subgraphs/name/sjuanati/gro-prod-eth',
        AVAX: 'https://api.thegraph.com/subgraphs/name/sjuanati/gro-prod-avax',
    },
    PROD_STUDIO: {
        ETH: 'https://api.studio.thegraph.com/query/35003/gro-mainnet/v0.0.5c',
        AVAX: 'https://api.thegraph.com/subgraphs/name/sjuanati/gro-prod-avax', // (1)
    },
    TEST_HOSTED: {
        ETH: 'https://api.thegraph.com/subgraphs/name/sjuanati/gro-test-eth',
        AVAX: 'https://api.thegraph.com/subgraphs/name/sjuanati/gro-test-avax',
    },
    PROD_AWS: {
        ETH: 'http://ec2-13-40-62-97.eu-west-2.compute.amazonaws.com:8000/subgraphs/name/groLabs/hackathon-subgraph',
    },
    UNKNOWN: {
        ETH: 'NA',
        AVAX: 'NA',
    }
}

