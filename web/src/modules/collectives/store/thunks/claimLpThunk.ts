import BigNumber from "bignumber.js";
import {
  NonPayableTransactionObject,
  NonPayableTx,
} from "../../../../lib/abis/types/types";
import { claim } from "../../../../lib/web3/builder";
import { web3Instance } from "../../../app/services";
import { AppActionThunk } from "../../../app/store";
import { selectSelectedCollectiveAddress } from "../../../collectives/store/collectives.selectors";
import { getCollectivesThunk } from "../../../collectives/store/thunks/getCollectivesThunk";
import { updateClaimableThunk } from "../../../collectives/store/thunks/updateClaimableThunk";
import {
  fetchRecommendedMaxFee,
  getRealisticGasLimit,
} from "../../../exchange/services/gas.service";
import { setTransactionStatus } from "../../../exchange/store/exchange.reducer";
import {
  TransactionStatus,
  TransactionTypes,
} from "../../../exchange/store/exchange.store";
import { selectWalletAccount } from "../../../wallet/store/wallet.selectors";

export const claimLpThunk: AppActionThunk =
  (amount: BigNumber) => async (dispatch, getState) => {
    try {
      const wallet = selectWalletAccount(getState());

      let method: NonPayableTransactionObject<any>;

      const proxy = selectSelectedCollectiveAddress(getState());

      method = claim(proxy!);

      const gasPrice = Math.ceil(+(await web3Instance().eth.getGasPrice()));

      const estimatedGas = Math.ceil(
        await method.estimateGas({
          from: wallet,
        })
      );

      const gas = getRealisticGasLimit(estimatedGas);

      const maxFeePerGas = await fetchRecommendedMaxFee();

      // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
      const sendTx = (props: NonPayableTx) =>
        method
          .send(props)
          .once("sending", () => {
            dispatch(
              setTransactionStatus({
                status: TransactionStatus.pendingMmApproval,
                type: TransactionTypes.claim,
              })
            );
          })
          .once("transactionHash", (hash: string) => {
            dispatch(
              setTransactionStatus({
                status: TransactionStatus.pendingConfirmation,
                type: TransactionTypes.claim,
              })
            );
          })
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          .once("receipt", (_receipt: any) => {
            dispatch(
              setTransactionStatus({
                status: TransactionStatus.confirmed,
                type: TransactionTypes.claim,
              })
            );
            void dispatch(getCollectivesThunk());
            void dispatch(updateClaimableThunk())

            // Refecth Stats and wallet info after transaction complete
          });

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const handleTxError = (error: any): void => {
        const message = error.message.split(":")[0];
        const isTimingOut = message.includes("50 blocks");
        dispatch(
          setTransactionStatus({
            status: isTimingOut
              ? TransactionStatus.timeout
              : TransactionStatus.error,
            type: TransactionTypes.claim,
          })
        );
      };

      const txn = {
        from: wallet,
        gas,
        maxFeePerGas,
      };

      void sendTx(txn) // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .on("error", (error: any) => {
          if (error.message.toLowerCase().includes("50 blocks")) {
            // retry with legacy params
            void sendTx({
              from: wallet,
              gas,
              gasPrice,
            }).on("error", handleTxError);
          } else {
            handleTxError(error);
          }
        });
    } catch (error: any) {
      // eslint-disable-next-line no-console
      console.warn("claimLpThunk.error", error);
    }
  };
