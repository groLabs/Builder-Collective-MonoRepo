import {
  ActionCreator,
  AnyAction,
  configureStore,
  Dispatch,
  isPlain,
} from "@reduxjs/toolkit";
import BigNumber from "bignumber.js";
import { ThunkAction, ThunkDispatch } from "redux-thunk";
import { rootReducer } from "./root.reducers";

export const store = configureStore({
  // https://redux-toolkit.js.org/api/getDefaultMiddleware#included-default-middleware
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        isSerializable: (value: any) => {
          // serializable bignumbers
          if (value instanceof BigNumber) {
            return true;
          }
          return isPlain(value);
        },
      },
    }),
  reducer: rootReducer,
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = ThunkDispatch<RootState, void, AnyAction> &
  Dispatch &
  typeof store.dispatch;

export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  AnyAction
>;
export type AppActionThunk<ReturnType = void> = ActionCreator<
  ThunkAction<ReturnType, RootState, unknown, AnyAction>
>;
