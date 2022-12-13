/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable func-style */

import WalletConnectProvider from "@walletconnect/web3-provider";
import Web3 from "web3";
import { Status } from "../../../app/app.types";
import { PROVIDERS } from "../../../app/providers.constants";
import { setWeb3Instance, web3Instance } from "../../../app/services";
import { setCurrentProvider } from "../../../app/services/providers.service";
import { AppActionThunk } from "../../../app/store";
import {
  setHardwareWalletLoading,
  setLoadingProvider,
  setNetworkId,
  setProviderName,
  setWalletStatus,
} from "../wallet.reducers";
import { selectNetworkId } from "../wallet.selectors";
import { initWalletThunk } from "./initWalletThunk";

export const connectProviderThunk: AppActionThunk =
  (provider: WalletConnectProvider | any, providerName: string) =>
  async (dispatch, getState) => {
    try {
      // Good to reload as all the initialisation steps will occur correctly
      // Reload Window on network changes and account changes including when account is connected

      provider.on("chainChanged", (e: number) => {
        const networkId = selectNetworkId(getState());
        if (e !== networkId && !!networkId) {
          // This is to avoid infinite reloading with coinbase wallet
          window.location.reload();
        }
      });
      provider.on("accountsChanged", () => window.location.reload());
      provider.on("disconnect", async () => {
        localStorage.clear();
        window.location.reload();
      });

      setCurrentProvider(provider);
      localStorage.setItem("provider", providerName);
      setWeb3Instance(new Web3(provider));
      const web3 = web3Instance();

      // Check which network we're on
      const chainId = await web3.eth.getChainId();

      dispatch(setNetworkId(chainId));
      dispatch(setProviderName(providerName));
      dispatch(setLoadingProvider(false));

      // Get accounts and if we have some, dispatch initWallet
      // Will return an empty array if the provider is not connected
      let accounts = [];
      accounts = await web3.eth.getAccounts();
      if (accounts.length === 0) {
        dispatch(setWalletStatus({ status: Status.error }));
        // Don't do anything until user requests connection
        return;
      }

      if (
        [PROVIDERS.WALLETCONNECT, PROVIDERS.METAMASK].includes(providerName) &&
        !localStorage.getItem("provider")
      ) {
        window.location.reload();
      }
      // Connected correctly.
      // localStorage.setItem('provider', providerName);

      const account = accounts[0];
      dispatch(setHardwareWalletLoading(false));
      await dispatch(initWalletThunk(account));
      
    } catch (error: any) {
      // eslint-disable-next-line no-console
      console.warn("useWeb3.error", error);
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      dispatch(setHardwareWalletLoading(false));
      dispatch(setWalletStatus({ error: error.message, status: Status.error }));
    }
  };
