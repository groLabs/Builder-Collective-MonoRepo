/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-unsafe-return */
import { createSelector } from "@reduxjs/toolkit";
import { ScCreatorState } from "./scCreator.store";
import { RootState } from "../../app/store";
import BigNumber from "bignumber.js";

export function selectScCreatorState(state: RootState): ScCreatorState {
  return state.scCreator;
}

export const selectCollectiveName = createSelector(
  selectScCreatorState,
  (state) => state.name || "Collective Name"
);

export const selectCollectiveUsers = createSelector(
  selectScCreatorState,
  (state) => {
    return state.users.filter((user) => user.address && user.name);
  }
);

export const selectCliffDate = createSelector(selectScCreatorState, (state) =>
  state.cliff 
);

export const selectEndDate = createSelector(selectScCreatorState, (state) =>
  state.end
);

export const selectParticipants = createSelector(
  selectScCreatorState,
  (state) => {
    const tvl = state.participants.reduce((curr, next) => {
      return curr.plus(next.value);
    }, new BigNumber(0));
    return state.participants.map((participant) => ({
      ...participant,
      allocation: new BigNumber(participant.value).dividedBy(tvl),
    }));
  }
);



export const selectParticipantsNames = createSelector(
  selectParticipants,
  (participants) => participants.map((elem) => elem.name)
);

export const selectParticipantsAddresses = createSelector(
  selectParticipants,
  (participants) => participants.map((elem) => elem.address)
);

export const selectParticipantsTokens = createSelector(
  selectParticipants,
  (participants) => participants.map((elem) => elem.token)
);

export const selectTokenPrices = createSelector(
  selectParticipants,
  (participants) => participants.map((elem) => new BigNumber(elem.price))
);

export const selectTokenDecimals = createSelector(
  selectScCreatorState,
  (state) => state.tokenDecimals
);

export const selectTokenAmountWithDecimals = createSelector(
  selectTokenDecimals,
  selectParticipants,
  (tokenDecimals, participants) => {
    return participants.map((participant) => {
      const decimal = tokenDecimals[participant.token.toLowerCase()];
      const amount = decimal
        ? new BigNumber(participant.amount).shiftedBy(decimal)
        : new BigNumber(participant.amount);

        console.log(amount.toNumber(), 'HE')
      return amount;
    });
  }
);

export const selectCollectiveInfo = createSelector(selectScCreatorState, (state) => [
  new BigNumber(state.end || 0).multipliedBy(2592000),
  new BigNumber(state.cliff || 0).multipliedBy(2592000),
  new BigNumber(0),
]);
