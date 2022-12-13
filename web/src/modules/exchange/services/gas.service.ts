import axios from "axios";

export const DEFI_PULSE_KEY =
  process.env.REACT_APP_DEFIPULSE_ID ||
  "332f580550dcb695d20ea90f82244903d13785db0b6b25847b7c1d40998a";

// values in x10 gwei
// https://docs.ethgasstation.info/gas-price
export type GasPrices = {
  average: number;
  avgWait: number;
  blockNum: number;
  block_time: number;
  fast: number;
  fastWait: number;
  fastest: number;
  fastestWait: number;
  safeLow: number;
  safeLowWait: number;
  speed: number;
};

const defaultGasPrices = {
  average: 0,
  avgWait: 0,
  block_time: 0,
  blockNum: 0,
  fast: 0,
  fastest: 0,
  fastestWait: 0,
  fastWait: 0,
  safeLow: 0,
  safeLowWait: 0,
  speed: 0,
};

export async function fetchGasPrice(): Promise<GasPrices> {
  try {
    const { data } = await axios.get<GasPrices>(
      `https://ethgasstation.info/api/ethgasAPI.json?api-key=${DEFI_PULSE_KEY}`
    );

    return data;
  } catch (e) {
    return defaultGasPrices;
  }
}

export async function fetchRecommendedMaxFee(): Promise<number | undefined> {
  return Math.ceil((await fetchGasPrice()).fast * 100000000) || undefined;
}

export function getRealisticGasLimit(estimatedGas: number): number {
  const gasWithMultiplier = estimatedGas * 1.2;
  const gasWithBuffer = estimatedGas + 20000;
  return gasWithMultiplier > gasWithBuffer
    ? Math.ceil(gasWithMultiplier)
    : Math.ceil(gasWithBuffer);
}
