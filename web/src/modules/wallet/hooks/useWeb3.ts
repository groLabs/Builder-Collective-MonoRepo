/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import React from "react";
import { useDispatch } from "react-redux";
import { Status } from "../../app/app.types";
import { PROVIDERS } from "../../app/providers.constants";
import {
  getCoinbaseWalletProvider,
  getStoredMetamaskProvider,
  getWalletConnectProvider,
} from "../../app/services/providers.service";
import { connectProviderThunk } from "../store/thunks/connectProviderThunk";
import { setLoadingProvider, setWalletStatus } from "../store/wallet.reducers";

export function useWeb3(): void {
  const dispatch = useDispatch();

  React.useEffect(() => {
    async function initialize(): Promise<void> {
      // Indicator of previous connection
      dispatch(setLoadingProvider(true));
      const storedProvider = localStorage.getItem("provider");

      if (storedProvider) {
        // We previously connected with metamask, try to restore connection
        if (storedProvider === PROVIDERS.METAMASK) {
          const { provider } = await getStoredMetamaskProvider();

          if (provider) {
            dispatch(connectProviderThunk(provider, PROVIDERS.METAMASK));
            return;
          }
        }

        // We previously connected with wallet connect, try to restore connection
        if (storedProvider === PROVIDERS.WALLETCONNECT) {
          const { provider } = await getWalletConnectProvider();

          if (provider) {
            dispatch(connectProviderThunk(provider, PROVIDERS.WALLETCONNECT));

            return;
          }
        }

        if (storedProvider === PROVIDERS.COINBASE) {
          const { provider } = await getCoinbaseWalletProvider();

          if (provider) {
            dispatch(connectProviderThunk(provider, PROVIDERS.COINBASE));
            return;
          }
        }

        // if (storedProvider === PROVIDERS.LEDGER) {
        //     const { account, provider } = await getLedgerProvider();

        //     if (provider) {
        //         dispatch(connectProviderThunk(provider, PROVIDERS.LEDGER, account));
        //         return;
        //     }
        // }
      }

      // No previous connection or error while fetching providers.
      dispatch(setLoadingProvider(false));
      dispatch(
        setWalletStatus({ error: "Wallet not connected", status: Status.error })
      );
    }

    void initialize();
  }, [dispatch]);
}
