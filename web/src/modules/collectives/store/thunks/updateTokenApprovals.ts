import { pokeApproval } from "../../../../lib/web3/builder";
import { AppActionThunk } from "../../../app/store";
import { setApprovals } from "../collectives.reducer";
import { selectSelectedCollectiveAddress } from "../collectives.selectors";

export const updateTokenApprovals: AppActionThunk =
  () => async (dispatch, getState) => {
    try {
      const proxy = selectSelectedCollectiveAddress(getState());
      
      if (proxy) {
        const approvals = await pokeApproval(proxy);
        dispatch(setApprovals(approvals));
      }
    } catch (error: any) {
      // eslint-disable-next-line no-console
      console.warn("updateTokenApprovals.error", error);
    }
  };
