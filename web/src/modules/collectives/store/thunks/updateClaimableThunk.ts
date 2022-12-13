import { getClaimableAmounts } from "../../../../lib/web3/builder";
import { AppActionThunk } from "../../../app/store";
import { setClaimable } from "../collectives.reducer";
import { selectAllParticipantsAddress, selectSelectedCollectiveAddress } from "../collectives.selectors";

export const updateClaimableThunk: AppActionThunk =
  () => async (dispatch, getState) => {
    try {
      const proxy = selectSelectedCollectiveAddress(getState());
      const wallet = selectAllParticipantsAddress(getState());

      if (proxy) {
         const promises = (wallet || []).map(async (token) => {
           const value = await getClaimableAmounts(proxy, token);
           dispatch(
             setClaimable({ key: token, value })
           );
         });
             
         
        await Promise.all(promises);

      }
    } catch (error: any) {
      // eslint-disable-next-line no-console
      console.warn("updateClaimableThunk.error", error);
    }
  };
