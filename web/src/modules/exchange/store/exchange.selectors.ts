import { createSelector } from "@reduxjs/toolkit";

import { RootState } from "../../app/store";
import {
  ExchangeState,
  TransactionStatus,
  TransactionTypes,
} from "./exchange.store";

export function selectExchangeState(state: RootState): ExchangeState {
  return state.exchange;
}

export const selectIsTransactionLoading = (type: TransactionTypes) =>
  createSelector(selectExchangeState, (state) => {
    const txn = state.transaction.find((elem) => elem.type === type);
    if(!txn) return false
    return (
      [
        TransactionStatus.pendingConfirmation,
        TransactionStatus.pendingMmApproval,
      ].includes(txn.status)
    );
  });


  export const selectIsTransactionSuccessfull = (type: TransactionTypes) =>
    createSelector(selectExchangeState, (state) => {
      const txn = state.transaction.find((elem) => elem.type === type);
      if (!txn) return false;
      return txn.status === TransactionStatus.confirmed;
    });

