import React, { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router";
import { CenteredWrapper } from "../components";
import { setSelectedCollective } from "../modules/collectives/store/collectives.reducer";
import { selectCollectivesLoading } from "../modules/collectives/store/collectives.selectors";
import { getCollectivesThunk } from "../modules/collectives/store/thunks/getCollectivesThunk";
import { updateClaimableThunk } from "../modules/collectives/store/thunks/updateClaimableThunk";
import { CollectiveDetails } from "../modules/collectives/components/CollectiveDetails";
import { LaunchedHeader } from "../modules/collectives/components/Launched/LaunchedHeader";
import { LaunchedTable } from "../modules/collectives/components/Launched/LaunchedTable";
import { updateTokenDecimalsThunk } from "../modules/scCreator/store/thunks/updateTokenDecimalsTunk";
import { fetchWalletBalance } from "../modules/wallet/store/thunks/fetchWalletBalance";
import { selectWalletAccount } from "../modules/wallet/store/wallet.selectors";

function CollectiveLaunched(): React.ReactElement {
  const history = useHistory();
  const dispatch = useDispatch();
  const wallet = useSelector(selectWalletAccount);
  const collectiveLoading = useSelector(selectCollectivesLoading)

  const param = useMemo(() => {
    const { search } = history.location;
    const result = new URLSearchParams(search);
    return result.get("address");
  }, [history]);

  useEffect(() => {
    void dispatch(getCollectivesThunk());
  }, [dispatch]);

  useEffect(() => {
    if (!!param && !collectiveLoading) {
      void dispatch(setSelectedCollective(param));
      void dispatch(updateTokenDecimalsThunk());
      void dispatch(updateClaimableThunk(param));
    }
  }, [param, collectiveLoading, dispatch]);

  useEffect(() => {
    if (wallet) {
      void dispatch(fetchWalletBalance());
    }
  }, [wallet, dispatch]);

  return (
    <CenteredWrapper>
      <CollectiveDetails />
      <LaunchedHeader />
      <LaunchedTable />
    </CenteredWrapper>
  );
}

export default CollectiveLaunched;
