export type ContractInfo = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  abi: any[];
  address: string;
  displayName: string;
  id: string;
};

export type TokenInfo = {
  decimals: number;
  image?: string;
  walletTokenName: string;
} & ContractInfo;
