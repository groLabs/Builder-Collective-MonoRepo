/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-unsafe-return */
import { createSelector } from "@reduxjs/toolkit";
import { WalletState } from "./wallet.store";
import { RootState } from "../../app/store";
import { Status } from "../../app/app.types";
import { isAVAXNetwork } from "../../app/app.helpers";

export function selectWalletState(state: RootState): WalletState {
  return state.wallet;
}

export const selectWalletLoading = createSelector(
  selectWalletState,
  (state) =>
    state.status !== Status.ready &&
    state.status !== Status.error &&
    state.status !== Status.idle
);

export const selectWalletAccount = createSelector(
  selectWalletState,
  (state) => state.account || ""
);

export const selectHasWalletConnected = createSelector(
  selectWalletAccount,
  (account) => !!account
);

export const selectHardwareWalletLoading = createSelector(
  selectWalletState,
  (state) => state.hardwareWalletLoading
);

export const selectIsAVAXNetwork = createSelector(
  selectWalletState,
  (state: WalletState) => isAVAXNetwork(state.networkId)
);

export const selectProviderName = createSelector(
  selectWalletState,
  (state: WalletState) => state.providerName
);

export const selectNetworkId = createSelector(
  selectWalletState,
  (state: WalletState) => state.networkId
);

export const selectIsRopsten = createSelector(
  selectNetworkId,
  (networkId: number) => networkId === 3
);

export const selectIsMainnet = createSelector(
  selectNetworkId,
  (networkId: number) => networkId === 1
);

export const selectWalletError = createSelector(
  selectWalletState,
  (state) => state.error
);


export const selectTokenBalances = createSelector(
  selectWalletState,
  (state) => state.tokens
);
