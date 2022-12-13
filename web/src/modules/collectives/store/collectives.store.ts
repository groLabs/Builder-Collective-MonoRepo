type Participant = {
  price: string;
  amount: string;
  name: string;
  tokenAddress: string;
  stakedAmount: string;
  participantAddress: {
    id: string;
  };
  participantClaims: {
    tokenAddress: string;
    claimAmount: string;
  };
};

export type Collective = {
  address: string;
  creation_date: number;
  started: boolean;
  started_date: number;
  cliff: number;
  vesting_time: number;
  participants: Participant[];
  ownerAddress: {
    id: string;
  };
};

export type CollectivesState = {
  list: Collective[];
  collectiveAddress?: string;
  loading: boolean;
  approvals: boolean[];
  claimable: { [key: string]: string[] };
};

export const initialCollectiveState: CollectivesState = {
  list: [],
  approvals: [],
  loading: false,
  collectiveAddress: undefined,
  claimable: {},
};
