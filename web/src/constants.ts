export enum NETWORK {
  AVALANCHE = "avalanche",
  MAINNET = "mainnet",
}

export enum EthereumNetworkCodes {
  avalanche = 43114,
  mainnet = 1,
}

export const ETHEREUM_NETWORK: TpMetaMaskSupportNetworks =
  process.env.REACT_APP_ETHEREUM_NETWORK || NETWORK.MAINNET;

export const AVALANCHE_NETWORK: TpMetaMaskSupportNetworks =
  process.env.REACT_APP_AVALANCHE_NETWORK || NETWORK.AVALANCHE;

export function etherscanAddressUrl(address = "", isAvax = false): string {
  if (isAvax) return `//snowtrace.io/address/${address}`;
  return ETHEREUM_NETWORK === NETWORK.MAINNET
    ? `//etherscan.io/address/${address}`
    : `//${ETHEREUM_NETWORK}.etherscan.io/address/${address}`;
}

export enum TOKENS {
  GRO = "gro",
}

export const isMainnet = ETHEREUM_NETWORK === NETWORK.MAINNET;

export const INFURA_ID =
  process.env.REACT_APP_INFURA_ID || "9aa3d95b3bc440fa88ea12eaa4456161";
