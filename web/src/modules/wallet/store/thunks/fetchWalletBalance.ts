/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable func-style */
// import { addTokenObjectDecimals } from "../../../../lib/web3/web3.helpers";
import BigNumber from "bignumber.js";
import { fetchTokenBalance, fetchTokenDecimals } from "../../../../lib/web3/token";
import { Status } from "../../../app/app.types";
import { AppActionThunk } from "../../../app/store";
import { selectSelectedCollectiveAddress } from "../../../collectives/store/collectives.selectors";

import { setTokenValues, setWalletStatus } from "../wallet.reducers";
import { selectWalletAccount } from "../wallet.selectors";

/**
 * Initializes balances for currently selected account.
 */
export const fetchWalletBalance: AppActionThunk<Promise<boolean>> =
  (account: string) => async (dispatch, getState) => {
    // const direction = selectExchangeDirection(getState());
    try {
      dispatch(setWalletStatus({ status: Status.loading }));
      const wallet = selectWalletAccount(getState())
      const token = selectSelectedCollectiveAddress(getState())

      if (token) {
          const balance = await fetchTokenBalance(token, wallet);
          const decimals = await fetchTokenDecimals(token)

          const final = new BigNumber(balance).shiftedBy(-decimals)

          dispatch(setTokenValues({ key: token.toLowerCase(), value: final }));
      }




      dispatch(setWalletStatus({ status: Status.ready }));
      // We dispatch the fetching of the exchange info on wallet ready

      return true;
    } catch (error: any) {
      // eslint-disable-next-line no-console
      console.warn("fetchWalletBalance.error", error);
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      dispatch(setWalletStatus({ error: error.message, status: Status.error }));
      return false;
    }
  };
