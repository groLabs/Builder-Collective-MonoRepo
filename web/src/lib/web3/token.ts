import BigNumber from "bignumber.js";
import { web3Instance } from "../../modules/app/services";
import tokenJson from "../abis/json/token.json";
import { Token } from "../abis/types/token";
import { convertToBN } from "./web3.helpers";

const abi = tokenJson;

export async  function fetchTokenDecimals(address: string) {
  const { Contract } = web3Instance().eth;
  const contract = new Contract(abi as any[], address) as any as Token;
  const decimals = await contract.methods.decimals().call();
 
  return new BigNumber(decimals);
}

export function approveToken(amount: BigNumber, address: string, proxy: string) {
  const { Contract } = web3Instance().eth;
  const contract = new Contract(abi as any[], address) as any as Token;
 
  return contract.methods.approve(proxy, convertToBN(amount));
}


export function fetchTokenBalance(address: string, wallet:string) {
  const { Contract } = web3Instance().eth;
  const contract = new Contract(abi as any[], address) as any as Token;
  const balance = contract.methods.balanceOf(wallet).call()
  return balance;
}