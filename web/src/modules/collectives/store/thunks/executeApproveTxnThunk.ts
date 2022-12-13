import BigNumber from "bignumber.js";
import {
  NonPayableTransactionObject,
  NonPayableTx,
} from "../../../../lib/abis/types/types";
import { approveToken, fetchTokenDecimals } from "../../../../lib/web3/token";
import { web3Instance } from "../../../app/services";
import { AppActionThunk } from "../../../app/store";
import { selectParticipant, selectSelectedCollectiveAddress } from "../../../collectives/store/collectives.selectors";
import { getCollectivesThunk } from "../../../collectives/store/thunks/getCollectivesThunk";
import { updateTokenApprovals } from "../../../collectives/store/thunks/updateTokenApprovals";
import { selectWalletAccount } from "../../../wallet/store/wallet.selectors";
import {
  fetchRecommendedMaxFee,
  getRealisticGasLimit,
} from "../../../exchange/services/gas.service";
import { setTransactionStatus } from "../../../exchange/store/exchange.reducer";
import { TransactionStatus, TransactionTypes } from "../../../exchange/store/exchange.store";

export const executeApproveTxnThunk: AppActionThunk =
  () => async (dispatch, getState) => {
    const wallet = selectWalletAccount(getState());

    const currentParticipant = selectParticipant(getState());
    
    const proxy = selectSelectedCollectiveAddress(getState())
    const decimals = await fetchTokenDecimals(currentParticipant?.token!);
    const amount = new BigNumber(currentParticipant?.amount!).shiftedBy(
      decimals.toNumber()
    );

    let method: NonPayableTransactionObject<any>;


    method = approveToken(amount, currentParticipant?.token!, proxy!);

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
              type: TransactionTypes.approve,
            })
          );
        })
        .once("transactionHash", (hash: string) => {
          dispatch(
            setTransactionStatus({
              status: TransactionStatus.pendingConfirmation,
              type: TransactionTypes.approve,
            })
          );
        })
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .once("receipt", (_receipt: any) => {
          dispatch(
            setTransactionStatus({
              status: TransactionStatus.confirmed,
              type: TransactionTypes.approve,
            })
          );
            void dispatch(getCollectivesThunk());
            void dispatch(updateTokenApprovals());
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
          type: TransactionTypes.approve,
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
  };
