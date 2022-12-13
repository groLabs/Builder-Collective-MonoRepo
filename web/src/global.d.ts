/* eslint-disable @typescript-eslint/consistent-type-definitions */
// False positives
/* eslint-disable no-unused-vars */
import type { MetaMaskInpageProvider } from "@metamask/inpage-provider";
import type Web3 from "web3";
import { NETWORK } from "./constants";

declare global {
  type TpMetaMaskSupportNetworks = NETWORK;

  interface Window {
    ethereum: MetaMaskInpageProvider;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    opera?: any;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    store?: any;
    web3: Web3 | undefined;
  }
  
  namespace NodeJS {
    interface ProcessEnv {
      REACT_APP_AVALANCHE_NETWORK: TpMetaMaskSupportNetworks | undefined;
      REACT_APP_DEFIPULSE_ID: string;
      REACT_APP_ETHEREUM_NETWORK: TpMetaMaskSupportNetworks | undefined;
      REACT_APP_GRO_API_BASE_URL: string | undefined;
      REACT_APP_INFURA_ID: string;
    }
  }
}