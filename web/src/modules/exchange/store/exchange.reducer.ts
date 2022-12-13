import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import BigNumber from "bignumber.js";
import { initialExchangeState, TransactionStatus, TransactionTypes } from "./exchange.store";

const emptyTxn = {
   status: TransactionStatus.idle,
  type: TransactionTypes.approve,
  tokenTo: {
    name: '',
    value: new BigNumber(0)
  }
}

const exchangeSlice = createSlice({
  initialState: initialExchangeState,
  name: "exchange",
  reducers: {
    setTransactionType(state, { payload }: PayloadAction<TransactionTypes>) {
      const list = state.transaction;
      const existing = state.transaction.findIndex(
        (elem) => elem.type === payload
      );
      if (existing >= 0) {
        list[existing].type = payload;
        list[existing].status = TransactionStatus.idle;
        state.transaction = list;
      } else {
        state.transaction.push({ ...emptyTxn, type: payload });
      }
    },
    setTransactionStatus(state, { payload }: PayloadAction<{type: TransactionTypes, status: TransactionStatus}>) {
      const list = state.transaction;
      const existing = state.transaction.findIndex(
        (elem) => elem.type === payload.type
      );
  
      if (existing >= 0) {
        list[existing].status = payload.status;
        state.transaction = list;
      }
    },
  },
});

export const {
  setTransactionStatus,
  setTransactionType,
} = exchangeSlice.actions;

export const exchangeReducer = exchangeSlice.reducer