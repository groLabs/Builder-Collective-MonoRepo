import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Collective, initialCollectiveState } from "./collectives.store";

const collectiveSlice = createSlice({
  initialState: initialCollectiveState,
  name: "collectives",
  reducers: {
    setCollectiveList(state, { payload }: PayloadAction<Collective[]>) {
      state.list = payload;
    },
    setSelectedCollective(state, { payload }: PayloadAction<string>) {
      state.collectiveAddress = payload;
    },
    setApprovals(state, { payload }: PayloadAction<boolean[]>) {
      state.approvals = payload;
    },
    setClaimable(
      state,
      { payload }: PayloadAction<{ key: string; value: string[] }>
    ) {
      state.claimable = {
        ...state.claimable,
        [payload.key.toLowerCase()]: payload.value
      };
    },
    setLoading(state, { payload }: PayloadAction<boolean>) {
      state.loading = payload;
    },
  },
});

export const {
  setCollectiveList,
  setSelectedCollective,
  setApprovals,
  setLoading,
  setClaimable,
} = collectiveSlice.actions;

export const collectiveReducer = collectiveSlice.reducer;
