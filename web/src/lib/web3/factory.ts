
import BigNumber from "bignumber.js";
import { web3Instance } from "../../modules/app/services";
import { factoryContract } from "../abis/factoryContract";
import { convertToBN } from "./web3.helpers";

type InitializeCollective = {
  names: string[];
  collectiveInfo: [BigNumber, BigNumber, BigNumber];
  tokens: string[];
  prices: BigNumber[];
  addresses: string[];
  tokenAmount: BigNumber[];
};

export function createNewFactory({
  names,
  collectiveInfo,
  tokens,
  prices,
  addresses,
  tokenAmount,
}: InitializeCollective) {
  const formattedPrices = prices.map((price) => convertToBN(price));
  const formattedTokenAmounts = tokenAmount.map((token) => convertToBN(token));
  const formatedCollective = collectiveInfo.map((elem) =>
    convertToBN(elem)
  ) as [string, string, string];
  const web3 = web3Instance();

  const encoded = web3.eth.abi.encodeFunctionCall(
    {
      name: "initialize",
      type: "function",
      inputs: [
        {
          internalType: "string[]",
          name: "_namesOfParticipants",
          type: "string[]",
        },
        {
          components: [
            {
              internalType: "uint32",
              name: "vestingTime",
              type: "uint32",
            },
            {
              internalType: "uint32",
              name: "cliff",
              type: "uint32",
            },
            {
              internalType: "uint32",
              name: "collectiveStart",
              type: "uint32",
            },
          ],
          internalType: "struct BuidlCollective.Collective",
          name: "_collectiveInfo",
          type: "tuple",
        },
        {
          internalType: "address[]",
          name: "_tokens",
          type: "address[]",
        },
        {
          internalType: "uint128[]",
          name: "_prices",
          type: "uint128[]",
        },
        {
          internalType: "address[]",
          name: "_users",
          type: "address[]",
        },
        {
          internalType: "uint256[]",
          name: "_targets",
          type: "uint256[]",
        },
      ],
    },
    [
      // @ts-ignore
      names,
      // @ts-ignore

      formatedCollective,
      // @ts-ignore
      tokens,
      // @ts-ignore
      formattedPrices,
      // @ts-ignore
      addresses,
      // @ts-ignore
      formattedTokenAmounts,
    ]
  );

  return factoryContract().methods.createNewBuilder(encoded);
}
