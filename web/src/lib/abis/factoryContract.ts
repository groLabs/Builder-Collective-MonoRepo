/* eslint-disable @typescript-eslint/no-explicit-any */
import { web3Instance } from "../../modules/app/services";
import { factory } from "../contract-info";
import { Factory } from "./types/factory";

let instance: Factory;

export function factoryContract(): Factory {
  if (instance) return instance;
  const { Contract } = web3Instance().eth;
  instance = new Contract(factory.abi, factory.address) as any as Factory;
  return instance;
}
