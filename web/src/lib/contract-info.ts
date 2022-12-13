import { ContractInfo } from "./web3.types";
import builderJson from "./abis/json/builder.json";
import factoryJson from "./abis/json/factory.json";

export type ContractAddresses = {
  builder: string;
  factory: string;
};

export const contractAddresses: ContractAddresses = {
  builder: "0x25C0a2F0A077F537Bd11897F04946794c2f6f1Ef",
  factory: "0x01cf58e264d7578D4C67022c58A24CbC4C4a304E",
};

export const builder: ContractInfo = {
  abi: builderJson,
  address: contractAddresses.builder,
  displayName: "Builder",
  id: "builder",
};

export const factory: ContractInfo = {
  abi: factoryJson,
  address: contractAddresses.factory,
  displayName: "Factory",
  id: "factory",
};
