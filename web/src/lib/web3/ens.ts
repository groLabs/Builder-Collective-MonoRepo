/* eslint-disable */
// @ts-ignore
import ENS from "ethereum-ens";
import { web3Provider } from "../../modules/app/services";

export async function getENS(address: string): Promise<string> {
  const ens = new ENS(web3Provider);

  const resolver = await ens.reverse(address);
  return (await resolver.name()) as Promise<string>;
}
