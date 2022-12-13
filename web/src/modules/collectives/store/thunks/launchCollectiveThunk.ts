import {
  NonPayableTransactionObject,
  NonPayableTx,
} from "../../../../lib/abis/types/types";
import { launchCollective } from "../../../../lib/web3/builder";
import { web3Instance } from "../../../app/services";
import { AppActionThunk } from "../../../app/store";
import { selectSelectedCollectiveAddress } from "../../../collectives/store/collectives.selectors";
import { getCollectivesThunk } from "../../../collectives/store/thunks/getCollectivesThunk";
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

export const launchCollectiveThunk: AppActionThunk =
  () => async (dispatch, getState) => {
    try {
      const wallet = selectWalletAccount(getState());

      let method: NonPayableTransactionObject<any>;

      const proxy = selectSelectedCollectiveAddress(getState());

      method = launchCollective(proxy!);

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
                type: TransactionTypes.launch,
              })
            );
          })
          .once("transactionHash", (hash: string) => {
            dispatch(
              setTransactionStatus({
                status: TransactionStatus.pendingConfirmation,
                type: TransactionTypes.launch,
              })
            );
          })
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          .once("receipt", (_receipt: any) => {
            void dispatch(getCollectivesThunk());
            dispatch(
              setTransactionStatus({
                status: TransactionStatus.confirmed,
                type: TransactionTypes.launch,
              })
            );

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
            type: TransactionTypes.launch,
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
      console.warn("launchCollectiveThunk.error", error);
    }
  };
