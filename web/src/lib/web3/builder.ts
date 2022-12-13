import BigNumber from "bignumber.js";
import { web3Instance } from "../../modules/app/services";
import { builder } from "../contract-info";
import { convertToBN } from "./web3.helpers";

export function launchCollective(proxy: string) {
  const { Contract } = web3Instance().eth;
  const contract = new Contract(builder.abi, proxy);
  return contract.methods.startCollective();
}

// 0x70997970C51812dc3A010C7d01b50e0d17dc79C8

export async function pokeApproval(proxy: string) {
  const { Contract } = web3Instance().eth;
  const contract = new Contract(builder.abi, proxy);
  const approvals = await contract.methods.pokeApproval().call();
  return approvals;
}

export function stake(value: BigNumber, proxy: string) {
  const { Contract } = web3Instance().eth;
  const contract = new Contract(builder.abi, proxy);
  return contract.methods.stake(convertToBN(value));
}

export function unstake(value: BigNumber, proxy: string) {
  const { Contract } = web3Instance().eth;
  const contract = new Contract(builder.abi, proxy);
  return contract.methods.unstake(convertToBN(value));
}

export async function unstakeAll(proxy: string) {
  const { Contract } = web3Instance().eth;
  const contract = new Contract(builder.abi, proxy);
  return contract.methods.unstakeAll();
}

export function claim(proxy: string) {
  const { Contract } = web3Instance().eth;
  const contract = new Contract(builder.abi, proxy);
  return contract.methods.claim();
}

export async function getClaimableAmounts(proxy: string, wallet: string) {
  const { Contract } = web3Instance().eth;
  const contract = new Contract(builder.abi, proxy);
  const claimable = contract.methods.getClaimable(wallet).call()
  return claimable
}