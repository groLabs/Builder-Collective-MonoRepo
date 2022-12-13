import { fetchTokenDecimals } from "../../../../lib/web3/token";
import { AppActionThunk } from "../../../app/store";
import { selectAllParticipantsTokens } from "../../../collectives/store/collectives.selectors";
import { setTokenDecimal } from "../scCreator.reducer";

export const updateTokenDecimalsThunk: AppActionThunk =
  () => async (dispatch, getState) => {
    try {
      const tokens = selectAllParticipantsTokens(getState());
      
      const promises = (tokens || []).map(async (token) => {
        const decimals = await fetchTokenDecimals(token);
        dispatch(setTokenDecimal({ key: token, value: decimals.toNumber() }));
      });

      await Promise.all(promises);
    } catch (error: any) {
      // eslint-disable-next-line no-console
      console.warn("updateTokenDecimalsThunk.error", error);
    }
  };
