import { createSelector } from "@reduxjs/toolkit";
import BigNumber from "bignumber.js";
import dayjs from "dayjs";

import { RootState } from "../../app/store";
import { selectTokenDecimals } from "../../scCreator/store/scCreator.selectors";
import {
  selectTokenBalances,
  selectWalletAccount,
} from "../../wallet/store/wallet.selectors";
import { CollectivesState } from "./collectives.store";

export function selectCollectiveState(state: RootState): CollectivesState {
  return state.collectives;
}

export const selectCollectiveList = createSelector(
  selectCollectiveState,
  (state) => {
    const list = state.list || [];
    return list.map((elem) => {
      return {
        proxy: elem.address,
        owner: elem.ownerAddress.id,
        started: elem.started,
        participants: elem.participants.length,
        tvl: elem.participants.reduce((curr, next) => {
          return curr.plus(new BigNumber(next.price).multipliedBy(next.amount));
        }, new BigNumber(0)),
        tokens: elem.participants.map((participant) => participant.tokenAddress)
          .length,
      };
    });
  }
);

export const selectConnectedUserCollectives = createSelector(
  selectCollectiveList,
  selectWalletAccount,
  (collective, wallet) =>
    collective.filter(
      (elem) => elem.owner.toLowerCase() === wallet.toLowerCase()
    )
);

export const selectUserCollectivesTvl = createSelector(
  selectConnectedUserCollectives,
  (state) =>
    state.reduce((curr, next) => {
      return curr.plus(next.tvl);
    }, new BigNumber(0))
);

export const selectAllCollectivesTvl = createSelector(
  selectCollectiveList,
  (state) =>
    state.reduce((curr, next) => {
      return curr.plus(next.tvl);
    }, new BigNumber(0))
);

export const selectSelectedCollectiveAddress = createSelector(
  selectCollectiveState,
  (state) => {
    return state.collectiveAddress;
  }
);

export const selectApprovals = createSelector(
  selectCollectiveState,
  (state) => {
    return state.approvals;
  }
);

export const selectCollective = createSelector(
  selectCollectiveState,
  selectSelectedCollectiveAddress,
  (state, address) => {
    const collective = (state.list || []).find(
      (elem) => elem.address.toLowerCase() === address?.toLowerCase()
    );
    return collective;
  }
);

export const selecCollectiveDates = createSelector(
  selectCollective,
  (collective) => {
    const date = dayjs((collective?.started_date || 0) * 1000);
    const cliff = date.add((collective?.cliff || 0) / 2592000, "month");
    const end = cliff.add((collective?.vesting_time || 0) / 2592000, "month");

    return {
      start: date.format("DD/MM/YYYY"),
      cliff: cliff.format("DD/MM/YYYY"),
      end: end.format("DD/MM/YYYY"),
    };
  }
);

export const selectCurrentCollective = createSelector(
  selectCollective,
  selectApprovals,
  (collective, approvals) => {
    return {
      address: collective?.address,
      owner: collective?.ownerAddress.id,
      vestingTime: collective?.vesting_time,
      cliff: collective?.cliff,
      started: collective?.started,
      creation: collective?.creation_date,
      participants: collective?.participants.map((elem, index) => ({
        name: elem.name,
        approved: approvals[index],
        price: elem.price,
        amount: elem.amount,
        token: elem.tokenAddress,
        value: new BigNumber(elem.price).multipliedBy(elem.amount).toString(),
        allocation: new BigNumber(0.32),
        address: elem.participantAddress.id,
      })),
    };
  }
);

export const selectCurrentCollectiveStarted = createSelector(
  selectCurrentCollective,
  (collective) => collective.started
);

export const selectCurrentCollectiveManager = createSelector(
  selectCurrentCollective,
  (collective) => collective.owner
);

export const selectCurrentCollectiveCreationDate = createSelector(
  selectCurrentCollective,
  (collective) => {
    const date = dayjs((collective?.creation || 0) * 1000);
    return date.format("DD/MM/YYYY");
  }
);

export const selectTotalParticipants = createSelector(
  selectCollective,
  (collective) => collective?.participants?.length
);

export const selectTotalTVL = createSelector(
  selectCurrentCollective,
  (state) => {
    return state.participants?.reduce((curr, next) => {
      return curr.plus(new BigNumber(next.price).multipliedBy(next.amount));
    }, new BigNumber(0));
  }
);

export const selectApprovedTVL = createSelector(
  selectCurrentCollective,
  selectApprovals,
  (collective, approvals) => {
    const filtered = collective.participants?.filter(
      (elem, index) => !!approvals[index]
    );
    return filtered?.reduce((curr, next) => {
      return curr.plus(new BigNumber(next.price).multipliedBy(next.amount));
    }, new BigNumber(0));
  }
);

export const selectCanLaunch = createSelector(
  selectWalletAccount,
  selectCurrentCollective,
  selectApprovals,
  (account, collective, approvals) => {
    const notApproved = approvals.filter((elem) => !elem);
    return (
      account.toLowerCase() === collective.owner?.toLowerCase() &&
      notApproved.length === 0 &&
      !collective.started
    );
  }
);

export const selectCollectiveVestingTime = createSelector(
  selectCurrentCollective,
  (collective) => (collective.vestingTime || 0) / 2592000
);

export const selectCollectiveCliffTime = createSelector(
  selectCurrentCollective,
  (collective) => (collective.cliff || 0) / 2592000
);

export const selectParticipant = createSelector(
  selectCurrentCollective,
  selectWalletAccount,
  (collective, wallet) => {
    const participant = collective.participants?.find(
      (participant) =>
        participant.address.toLowerCase() === wallet.toLowerCase()
    );
    return participant;
  }
);

export const selectLpBalance = createSelector(
  selectTokenBalances,
  selectSelectedCollectiveAddress,
  (balances, address) => {
    return balances ? balances[address?.toLowerCase()!] : new BigNumber(0);
  }
);

export const selectLatestCollectiveAddress = createSelector(
  selectCollectiveList,
  (list) => (list.length ? list[list.length - 1].proxy : "")
);

export const selectCollectivesLoading = createSelector(
  selectCollectiveState,
  (state) => state.loading
);

export const selectAllParticipantsTokens = createSelector(
  selectCurrentCollective,
  (collective) =>
    collective.participants?.map((participant) => participant.token)
);

export const selectAllParticipantsAddress = createSelector(
  selectCurrentCollective,
  (collective) =>
    collective.participants?.map((participant) => participant.address)
);

export const selectClaimableTokens = createSelector(
  selectCollectiveState,
  (state) => state.claimable
);

export const selectUsersClaimable = createSelector(
  selectClaimableTokens,
  selectAllParticipantsTokens,
  selectAllParticipantsAddress,
  selectTokenDecimals,
  (claimable, tokensAddress, addresses, decimals) => {
    const perAddress = addresses?.map((participantAddress) => {
      const amounts = claimable[participantAddress.toLowerCase()];
      const formatted = (amounts || []).map((elem, index) => {
        const address = (tokensAddress || [])[index];
        const tokenDecimals = decimals[address.toLowerCase()];
        return {
          value: tokenDecimals
            ? new BigNumber(elem).shiftedBy(-tokenDecimals)
            : new BigNumber(0),
          address,
        };
      });
      return { address: participantAddress, claimable: formatted };
    });

    return perAddress;
  }
);

export const selectCurrentUserClaimable = createSelector(
  selectUsersClaimable,
  selectWalletAccount,
  (usersClaimable, wallet) => {
    const userValue = usersClaimable?.find(
      (user) => user.address === wallet.toLowerCase()
    );
    return userValue?.claimable;
  }
);

export const selectAllClaimableDollar = createSelector(
  selectCurrentCollective,
  selectCurrentUserClaimable,
  (collective, claimable) => {
    return (claimable || []).reduce((curr, next) => {
      const address = next.address;
      const price = collective.participants?.find(
        (participant) =>
          participant.token.toLowerCase() === address.toLowerCase()
      )?.price;
      return curr.plus((next.value || 0).multipliedBy(price || 0));
    }, new BigNumber(0));
  }
);

export const selectLaunchedCollectiveParticipants = createSelector(
  selectCollective,
  selectUsersClaimable,
  (collective, claimable) => {
    return collective?.participants.map((participant) => {
      const userClaimable = claimable?.find(
        (user) =>
          user.address === participant.participantAddress.id.toLowerCase()
      );
      const claimableTotal = (userClaimable?.claimable || []).reduce(
        (curr, next) => {
          return curr.plus((next.value || 0).multipliedBy(participant.price));
        },
        new BigNumber(0)
      );

      return {
        name: participant.name,
        address: participant.participantAddress.id,
        tvl: new BigNumber(participant.price).multipliedBy(participant.amount),
        staked: new BigNumber(participant.stakedAmount),
        token: participant.tokenAddress,
        unvested: new BigNumber(participant.stakedAmount)
          .minus(claimableTotal),
        vested: claimableTotal,
        claimable: claimableTotal,
      };
    });
  }
);

export const selectParticipantStaked = createSelector(
  selectLaunchedCollectiveParticipants,
  selectWalletAccount,
  (participants, account) => {
    const participant = participants?.find(
      (elem) => elem.address.toLowerCase() === account.toLowerCase()
    );
    return new BigNumber(participant?.staked || 0);
  }
);
