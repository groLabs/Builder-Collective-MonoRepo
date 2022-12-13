export enum Subgraph {
  UNKNOWN = 'unknown',
  PROD_HOSTED = 'prod_hosted',
  PROD_STUDIO = 'prod_studio',
  TEST_HOSTED = 'test_hosted',
  TEST_STUDIO = 'test_studio',
  PROD_AWS = 'prod_aws',
}

export enum Env {
  PROD = 'prod',
  DEV = 'dev',
}

export enum Stats {
  ALL = 'all',
  PERSONAL = 'personal',
}

// @dev: Should be aligned with subgraph schema
export enum Token {
  UNKNOWN = 'unknown',
  PWRD = 'pwrd',
  GVT = 'gvt',
  GRO = 'gro',
  DAI = 'dai',
  USDC = 'usdc',
  USDT = 'usdt',
  TUSD = 'tusd',
  FRAX = 'frax',
  OUSD = 'ousd',
  ALUSD = 'alusd',
  GUSD = 'gusd',
  WETH = 'weth',
  AVAX = 'avax',
  BALANCER_GRO_WETH = 'balancer_gro_weth',
  UNISWAP_GVT_GRO = 'uniswap_gvt_gro',
  UNISWAP_GRO_USDC = 'uniswap_gro_usdc',
  CURVE_PWRD3CRV = 'curve_pwrd3crv',
}

// @dev: Should be aligned with subgraph schema
export enum TxType {
  CORE_DEPOSIT = 'core_deposit',
  CORE_WITHDRAWAL = 'core_withdrawal',
  STAKER_DEPOSIT = 'staker_deposit',
  STAKER_WITHDRAWAL = 'staker_withdrawal',
  TRANSFER_IN = 'transfer_in',
  TRANSFER_OUT = 'transfer_out',
  CLAIM = 'claim',
  MULTICLAIM = 'multiclaim',
  VEST = 'vest',
  APPROVAL = 'approval',
}

// @dev: Should be aligned with subgraph schema
export enum Status {
  OK = 'ok',
  ERROR = 'error',
}

// @dev: Should be aligned with subgraph schema
export enum NetworkName {
  MAINNET = 'mainnet',
  AVALANCHE = 'avalanche',
}

export enum NetworkId {
  MAINNET = '1',
  AVALANCHE = '43114',
}

export enum Route {
  GRO_STATS = 'gro_stats',
  PERSONAL_STATS = 'personal_stats',
}
