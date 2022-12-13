import React, { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router";
import { CenteredWrapper } from "../components";
import { setSelectedCollective } from "../modules/collectives/store/collectives.reducer";
import { selectSelectedCollectiveAddress } from "../modules/collectives/store/collectives.selectors";
import { getCollectivesThunk } from "../modules/collectives/store/thunks/getCollectivesThunk";
import { updateTokenApprovals } from "../modules/collectives/store/thunks/updateTokenApprovals";
import { CollectiveApproveHeader } from "../modules/collectives/components/Approve/CollectiveApproveHeader";
import { CollectiveApproveTable } from "../modules/collectives/components/Approve/CollectiveApproveTable";
import { CollectiveDetails } from "../modules/collectives/components/CollectiveDetails";

function CollectiveApprove(): React.ReactElement {
  const dispatch = useDispatch();
  const proxy = useSelector(selectSelectedCollectiveAddress);
  const history = useHistory();

  const param = useMemo(() => {
    const { search } = history.location;
    const result = new URLSearchParams(search);
    return result.get("address");
  }, [history]);

  useEffect(() => {
    void dispatch(getCollectivesThunk());
  }, [dispatch]);

  useEffect(() => {
    if (param) {
      void dispatch(setSelectedCollective(param));
    }
  }, [param, dispatch]);

  useEffect(() => {
    if (proxy) {
      void dispatch(updateTokenApprovals());
    }
  }, [proxy, dispatch]);

  return (
    <CenteredWrapper>
      <CollectiveDetails />
      <CollectiveApproveHeader />
      <CollectiveApproveTable />
    </CenteredWrapper>
  );
}

export default CollectiveApprove;