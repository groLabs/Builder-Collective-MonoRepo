import BigNumber from "bignumber.js";


export enum TransactionTypes {
    approve = 'approve',
    launch = 'launch',
    initialize = 'initialize',
    claim = 'claim',
    unstake = 'unstake',
    stake = 'stake',
    approveStake = 'approveStake'
}

export enum TransactionStatus {
  confirmed = "confirmed",
  error = "error",
  idle = "idle",
  loading = "loading",
  pendingApproval = "pendingApproval",
  pendingConfirmation = "pendingConfirmation",
  pendingMmApproval = "pendingMmApproval",
  ready = "ready",
  timeout = "timeout",
}

type Transaction = {
  status: TransactionStatus;
  type?: TransactionTypes;
  tokenTo: {
    name: string;
    value: BigNumber;
  };
};


export type ExchangeState = {
  transaction: Transaction[]
};

export const initialExchangeState: ExchangeState = {
    transaction: []
}