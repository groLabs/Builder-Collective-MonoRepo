/* eslint-disable no-param-reassign */
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import BigNumber from "bignumber.js";
import { Status } from "../../app/app.types";
import { initialWalletState } from "./wallet.store";

const walletSlice = createSlice({
  initialState: initialWalletState,
  name: "wallet",
  reducers: {
    clearValues: (state) => {
      state.error = undefined;
    },
    resetWallet: (state) => {
      state = { ...initialWalletState };
      return state;
    },
    setNotificationText(state, { payload }: PayloadAction<string>) {
      state.notification = payload;
    },
    setShowNotification(state, { payload }: PayloadAction<boolean>) {
      state.showNotification = payload;
    },
    setAccount: (state, { payload }: PayloadAction<string>) => {
      state.account = payload;
    },

    setConnectWalletModalOpened(state, { payload }: PayloadAction<boolean>) {
      state.isModalOpened = payload;
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    setError(state, { payload }: PayloadAction<any>) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      state.error = payload;
    },
    setHardwareWalletLoading(state, { payload }: PayloadAction<boolean>) {
      state.hardwareWalletLoading = payload;
    },
    setLoadingProvider(state, { payload }: PayloadAction<boolean>) {
      state.loadingProvider = payload;
    },
    setNetworkId(state, { payload }: PayloadAction<number>) {
      state.networkId = payload;
    },
    setProviderName(state, { payload }: PayloadAction<string>) {
      state.providerName = payload;
    },
    setWalletStatus(
      state,
      {
        payload,
      }: PayloadAction<{
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        error?: any;
        status: Status;
      }>
    ) {
      state.status = payload.status;
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      state.error = payload.error;
    },
    setTokenValues(
      state,
      { payload }: PayloadAction<{ key: string; value: BigNumber }>
    ) {
      state.tokens = {
        ...state.tokens,
        ...{ [payload.key]: payload.value },
      };
    },
  },
});

export const {
  clearValues,
  resetWallet,
  setAccount,
  setConnectWalletModalOpened,
  setError,
  setHardwareWalletLoading,
  setLoadingProvider,
  setNetworkId,
  setWalletStatus,
  setNotificationText,
  setShowNotification,
  setProviderName,
  setTokenValues
} = walletSlice.actions;

export const walletReducer = walletSlice.reducer;
