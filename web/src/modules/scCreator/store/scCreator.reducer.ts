/* eslint-disable no-param-reassign */
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { initialScCreatorState, Participant } from "./scCreator.store";

const scCreatorSlice = createSlice({
  initialState: initialScCreatorState,
  name: "scCreator",
  reducers: {
    setName(state, { payload }: PayloadAction<string>) {
      state.name = payload;
    },
    setUsers(
      state,
      { payload }: PayloadAction<{ address: string; name: string }[]>
    ) {
      state.users = payload;
    },
    setTokens(
      state,
      { payload }: PayloadAction<{ token: string; price?: number }[]>
    ) {
      state.tokens = payload;
    },
    setCliffStore(state, { payload }: PayloadAction<string | undefined>) {
      state.cliff = payload;
    },
    setEndStore(state, { payload }: PayloadAction<string | undefined>) {
      state.end = payload;
    },
    setParticipants(state, { payload }: PayloadAction<Participant[]>) {
      state.participants = payload;
    },
    setGenerator(state, { payload }: PayloadAction<string>) {
      state.generator = payload;
    },
    setTokenDecimal(
      state,
      { payload }: PayloadAction<{ key: string; value: number }>
    ) {
      state.tokenDecimals = {
        ...state.tokenDecimals,
        ...{ [payload.key.toLowerCase()]: payload.value },
      };
    },
    resetScCreator(state) {
      state = initialScCreatorState
    }
  },
});

export const {
  setName,
  setUsers,
  setTokens,
  setCliffStore,
  setEndStore,
  setParticipants,
  setGenerator,
  setTokenDecimal,
  resetScCreator,
} = scCreatorSlice.actions;

export const scCreatorReducer = scCreatorSlice.reducer;
