/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable consistent-return */
/* eslint-disable no-console */

import { useDispatch, useSelector } from "react-redux";
import { PROVIDERS } from "../../app/providers.constants";
import {
  closeSession,
  getLedgerProvider,
  getTrezorProvider,
} from "../../app/services/providers.service";
import { connectProviderThunk } from "../store/thunks/connectProviderThunk";
import {
  resetWallet,
  setAccount,
  setConnectWalletModalOpened,
  setHardwareWalletLoading,
  setNetworkId,
  setNotificationText,
  setShowNotification,
} from "../store/wallet.reducers";
import {
  selectIsAVAXNetwork,
  selectProviderName,
} from "../store/wallet.selectors";

type TpNetwork = {
  data: {
    blockExplorerUrls?: string[];
    chainId: string;
    chainName?: string;
    nativeCurrency?: {
      decimals: number;
      name: string;
      symbol: string;
    };
    rpcUrls?: string[];
  };

  icon: string;
  label: string;
};

type TpUseChangeNetworkReturn = {
  onChangeNetwork: (network: TpNetwork) => Promise<Promise<void>>;
  onClickDisconnect: () => Promise<void>;
};

type TpUseChangeNetwork = {
  setIsLoading?: (val: boolean) => void;
  setSelectedNetwork?: (val: TpNetwork | undefined) => void;
};

export function useChangeNetwork({
  setIsLoading = (val: boolean): void => {},
  setSelectedNetwork = (val: TpNetwork | undefined): void => {},
}: TpUseChangeNetwork): TpUseChangeNetworkReturn {
  const dispatch = useDispatch();
  const provider = useSelector(selectProviderName);
  const isAvax = useSelector(selectIsAVAXNetwork);

  async function onClickDisconnect(): Promise<void> {
    await closeSession();
    dispatch(resetWallet());
    dispatch(setConnectWalletModalOpened(true));
  }

  async function onChangeTrezorChain(): Promise<void> {
    try {
      await onClickDisconnect();
      dispatch(setHardwareWalletLoading(true));
      const trezor = await getTrezorProvider(!isAvax);
      if (trezor) {
        dispatch(connectProviderThunk(trezor.provider, PROVIDERS.TREZOR));
      }
    } catch (e) {
      console.warn("Trezor conection error:", e);
    }
  }

  async function onChangeLedgerChain(): Promise<void> {
    try {
      await onClickDisconnect();
      dispatch(setHardwareWalletLoading(true));
      const ledger = await getLedgerProvider(!isAvax);
      if (ledger) {
        dispatch(connectProviderThunk(ledger.provider, PROVIDERS.LEDGER));
      }
    } catch (e) {
      console.warn("Ledger conection error:", e);
    }
  }

  async function onChangeChain(network: TpNetwork): Promise<Promise<void>> {
    const { web3 }: any = window;
    if (web3) {
      setIsLoading(true);
      setSelectedNetwork(network);
      try {
        return await new Promise((resolve, reject) => {
          web3.currentProvider
            .request({
              method: "wallet_switchEthereumChain",
              params: [{ chainId: network.data.chainId }],
            })
            .then(() => {
              setIsLoading(false);
              setSelectedNetwork(undefined);
              resolve();
            })
            .catch((e: Error) => {
              setIsLoading(false);
              setSelectedNetwork(undefined);
              reject(e);
            });
          setTimeout(() => {
            if (provider === PROVIDERS.WALLETCONNECT) {
              dispatch(
                setNotificationText(
                  "Please, change networks using your wallet."
                )
              );
              dispatch(setShowNotification(true));
              setIsLoading(false);
              setSelectedNetwork(undefined);
              reject(new Error());
            }
          }, 2000);
        });
      } catch (error: any) {
        console.warn(error);
        if (error.code === 4902) {
          try {
            await web3.currentProvider.request({
              method: "wallet_addEthereumChain",
              params: [network.data],
            });
            setIsLoading(false);
          } catch (addError) {
            setIsLoading(false);
            setSelectedNetwork(undefined);
          }
        }
        setIsLoading(false);
        setSelectedNetwork(undefined);
      }
    }
  }

  async function onChangeNetwork(network: TpNetwork): Promise<Promise<void>> {
    if (provider === PROVIDERS.TREZOR) {
      await onChangeTrezorChain();
    } else if (provider === PROVIDERS.LEDGER) {
      await onChangeLedgerChain();
    } else {
      await onChangeChain(network);
    }
  }

  return {
    onChangeNetwork,
    onClickDisconnect,
  };
}
