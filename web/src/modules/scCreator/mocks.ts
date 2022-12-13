import BigNumber from "bignumber.js";

export type Position = {
  name: string;
  address: string;
  tvl: BigNumber;
  unvested: BigNumber;
  vested: BigNumber;
  staked: BigNumber;
  claimable: BigNumber;
  token: string;
};

export const position = [
  {
    name: "Jimemart",
    address: "0x106E7ECA4A0DAc78EadfaB1FeA20336290694139",
    tvl: new BigNumber(25575),
    unvested: new BigNumber(17135.25),
    vested: new BigNumber(8439.75),
    staked: new BigNumber(2000),
    claimable: new BigNumber(1000),
  },
  {
    name: "Haywired",
    address: "0xcE75EC633fAd9def03f4524870a0CA565b92100C",
    tvl: new BigNumber(25575),
    unvested: new BigNumber(17135.25),
    vested: new BigNumber(8439.75),
    staked: new BigNumber(0),
    claimable: new BigNumber(0),
  },
  {
    name: "Pepe",
    address: "0x859Df1B9Bb101715b7C9BfC213378e383d216241",
    tvl: new BigNumber(25575),
    unvested: new BigNumber(17135.25),
    vested: new BigNumber(8439.75),
    staked: new BigNumber(0),
    claimable: new BigNumber(0),
  },
];