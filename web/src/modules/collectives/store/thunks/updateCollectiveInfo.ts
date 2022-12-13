import { AppActionThunk } from "../../../app/store";
import { getCollectives } from "../../../scCreator/services/collectives";
import { setCollectiveList } from "../collectives.reducer";

export const updateCollectiveInfo: AppActionThunk =
  () => async (dispatch, getState) => {
    try {
      const data = await getCollectives();

      dispatch(setCollectiveList(data.collectives));
    } catch (error: any) {
      // eslint-disable-next-line no-console
      console.warn("getCollectivesThunk.error", error);
    }
  };
