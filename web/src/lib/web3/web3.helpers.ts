import BigNumber from "bignumber.js";
import Web3 from "web3";

export function convertToBN(value: BigNumber = new BigNumber(0)): string {
  return Web3.utils.toBN(value.toFormat(0, {})).toString();
}
