import BigNumber from "bignumber.js";
import {
  NonPayableTransactionObject,
  NonPayableTx,
} from "../../../../lib/abis/types/types";
import { createNewFactory } from "../../../../lib/web3/factory";
import { fetchTokenDecimals } from "../../../../lib/web3/token";
import { web3Instance } from "../../../app/services";
import { AppActionThunk } from "../../../app/store";
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
import {
  resetScCreator,
  setTokenDecimal,
} from "../scCreator.reducer";
import {
  selectCollectiveInfo,
  selectParticipantsAddresses,
  selectParticipantsNames,
  selectParticipantsTokens,
  selectTokenAmountWithDecimals,
  selectTokenPrices,
} from "../scCreator.selectors";

export const initializeCollectiveThunk: AppActionThunk =
  () => async (dispatch, getState) => {
    try {
      const tokens = selectParticipantsTokens(getState());

      const promises = tokens.map(async (token) => {
        const decimals = await fetchTokenDecimals(token);
        dispatch(setTokenDecimal({ key: token, value: decimals.toNumber() }));
      });

      await Promise.all(promises);

      const wallet = selectWalletAccount(getState());

      const names = selectParticipantsNames(getState());
      const collectiveInfo = selectCollectiveInfo(getState());
      const tokenAddress = selectParticipantsTokens(getState());
      const prices = selectTokenPrices(getState());
      const addresses = selectParticipantsAddresses(getState());
      const tokenAmount = selectTokenAmountWithDecimals(getState());

      let method: NonPayableTransactionObject<any>;

      method = createNewFactory({
        names,
        collectiveInfo: collectiveInfo as [BigNumber, BigNumber, BigNumber],
        tokens: tokenAddress,
        prices,
        addresses,
        tokenAmount,
      });

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
                type: TransactionTypes.initialize,
              })
            );
          })
          .once("transactionHash", (hash: string) => {
            dispatch(
              setTransactionStatus({
                status: TransactionStatus.pendingConfirmation,
                type: TransactionTypes.initialize,
              })
            );
          })
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          .once("receipt", (_receipt: any) => {
            setTimeout(() => {
              void dispatch(resetScCreator());
              void dispatch(getCollectivesThunk());
              dispatch(
                setTransactionStatus({
                  status: TransactionStatus.confirmed,
                  type: TransactionTypes.initialize,
                })
              );
            }, 1500);

            // Refecth Stats and wallet info after transaction complete
          });

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const handleTxError = (error: any): void => {
        const message = error.message.split(":")[0];
        const isTimingOut = message.includes("50 blocks");
        void dispatch(resetScCreator());
        dispatch(
          setTransactionStatus({
            status: isTimingOut
              ? TransactionStatus.timeout
              : TransactionStatus.error,
            type: TransactionTypes.initialize,
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
      console.warn("initializeCollectiveThunk.error", error);
    }
  };
