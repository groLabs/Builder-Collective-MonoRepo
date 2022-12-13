import { AppActionThunk } from "../../../app/store";
import { getCollectives } from "../../../scCreator/services/collectives";
import { setCollectiveList, setLoading } from "../collectives.reducer";


export const getCollectivesThunk: AppActionThunk =
  () => async (dispatch, getState) => {
    try {
      dispatch(setLoading(true))
     const data = await getCollectives()

     dispatch(setCollectiveList(data.collectives))
     dispatch(setLoading(false))
    } catch (error: any) {
      // eslint-disable-next-line no-console
      dispatch(setLoading(false))
      console.warn("getCollectivesThunk.error", error);
    }
  };
