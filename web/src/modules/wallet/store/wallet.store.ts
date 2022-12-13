import BigNumber from "bignumber.js";
import { Status, StatusState } from "../../app/app.types";

export type WalletState = {
  account?: string;
  hardwareWalletLoading: boolean;
  isModalOpened: boolean;
  loadingProvider: boolean;
  networkId: number;
  providerName: string;
  notification: string;
  showNotification: boolean;
  tokens: {
    [key: string]: BigNumber
  }
} & StatusState;

export const initialWalletState: WalletState = {
  account: undefined,
  error: undefined,
  hardwareWalletLoading: false,
  isModalOpened: false,
  showNotification: false,
  notification: '',
  loadingProvider: true,
  networkId: 0,
  providerName: "",
  status: Status.idle,
  tokens: {}
};
