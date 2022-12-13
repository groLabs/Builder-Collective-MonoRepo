import React, { useEffect } from "react";
import { Box, Typography } from "@mui/material";
import { CenteredWrapper } from "../components";

import { CreateCollective } from "../modules/scCreator/components/CreateCollective";
import { useDispatch, useSelector } from "react-redux";
import { getCollectivesThunk } from "../modules/collectives/store/thunks/getCollectivesThunk";
import { CollectivesList } from "../modules/collectives/components/CollectivesList";
import {
  selectAllCollectivesTvl,
  selectCollectiveList,
  selectConnectedUserCollectives,
  selectUserCollectivesTvl,
} from "../modules/collectives/store/collectives.selectors";
import { resetScCreator } from "../modules/scCreator/store/scCreator.reducer";

function Dashboard(): React.ReactElement {
  const list = useSelector(selectCollectiveList);
  const currentTvl = useSelector(selectUserCollectivesTvl);
  const tvlAllCollectives = useSelector(selectAllCollectivesTvl);
  const listUserCollectives = useSelector(selectConnectedUserCollectives);

  const dispatch = useDispatch();

  useEffect(() => {
    void dispatch(resetScCreator());
    void dispatch(getCollectivesThunk());
  }, [dispatch]);

  return (
    <Box pb={15}>
      <CenteredWrapper>
        <Box mt={9}>
          <Typography variant="h3" textAlign="center" mb={2.5}>
            Collectives for web3 builders to share knowledge and financial
            upside.
          </Typography>
        </Box>
        <CreateCollective />
        {listUserCollectives.length > 0 && (
          <CollectivesList
            mt={7.5}
            title="Your collectives"
            tvl={currentTvl}
            list={listUserCollectives}
          />
        )}
        <CollectivesList
          mt={7.5}
          title="Active collectives"
          tvl={tvlAllCollectives}
          list={list}
        />
      </CenteredWrapper>
    </Box>
  );
}

export default Dashboard;
