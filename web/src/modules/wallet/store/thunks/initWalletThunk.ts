/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable func-style */
// import { addTokenObjectDecimals } from "../../../../lib/web3/web3.helpers";
import { Status } from "../../../app/app.types";
import { AppActionThunk } from "../../../app/store";

import {
  setAccount,
  setWalletStatus,
} from "../wallet.reducers";

/**
 * Initializes balances for currently selected account.
 */
export const initWalletThunk: AppActionThunk<Promise<boolean>> =
  (account: string) => async (dispatch, getState) => {
    // const direction = selectExchangeDirection(getState());
    try {
      dispatch(setWalletStatus({ status: Status.loading }));
      dispatch(setAccount(account));
      dispatch(setWalletStatus({ status: Status.ready }));
      // We dispatch the fetching of the exchange info on wallet ready

      return true;
    } catch (error: any) {
      // eslint-disable-next-line no-console
      console.warn("initWalletThunk.error", error);
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      dispatch(setWalletStatus({ error: error.message, status: Status.error }));
      return false;
    }
  };
