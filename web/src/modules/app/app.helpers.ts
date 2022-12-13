import {
  AVALANCHE_NETWORK,
  EthereumNetworkCodes,
} from "../../constants";

export function isAVAXNetwork(chainId: number): boolean {
  return chainId === EthereumNetworkCodes[AVALANCHE_NETWORK];
}

export function isCorrectNetwork(chainId: number): boolean {
  return [
    EthereumNetworkCodes.mainnet,
    EthereumNetworkCodes.avalanche,
  ].includes(chainId);
}