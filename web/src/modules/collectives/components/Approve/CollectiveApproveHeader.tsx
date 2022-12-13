import { Box, Button, CircularProgress, Typography } from "@mui/material";
import React, { useEffect } from "react";
import { css } from "@emotion/react";
import { useDispatch, useSelector } from "react-redux";
import { launchCollectiveThunk } from "../../store/thunks/launchCollectiveThunk";
import { setTransactionType } from "../../../exchange/store/exchange.reducer";
import { TransactionTypes } from "../../../exchange/store/exchange.store";
import {
  selectIsTransactionLoading,
  selectIsTransactionSuccessfull,
} from "../../../exchange/store/exchange.selectors";
import { useHistory } from "react-router";
import {
  selectApprovedTVL,
  selectCanLaunch,
  selectCollectiveCliffTime,
  selectCollectivesLoading,
  selectCollectiveVestingTime,
  selectCurrentCollectiveStarted,
  selectSelectedCollectiveAddress,
  selectTotalTVL,
} from "../../store/collectives.selectors";
import { formatNumber, formatPct } from "../../../../utils";

export function CollectiveApproveHeader(): React.ReactElement {
  const history = useHistory()

  const styles = {
    wrapperBlue: css`
      border: 1px solid #0288d1;
      border-radius: 12px;
    `,
    wrapper: css`
      border: 1px solid rgba(0, 0, 0, 0.3);
      border-radius: 12px;
    `,
    wrapperGrey: css`
      background: #f5f5f5;
      border-radius: 12px;
    `,
  };
  const dispatch = useDispatch();

  const cliffDate = useSelector(selectCollectiveCliffTime);
  const endDate = useSelector(selectCollectiveVestingTime);
  const canLaunch = useSelector(selectCanLaunch);
  const approvedTVL = useSelector(selectApprovedTVL);
  const totalTVL = useSelector(selectTotalTVL)
  const proxy = useSelector(selectSelectedCollectiveAddress)
  const started = useSelector(selectCurrentCollectiveStarted);

  const pct = approvedTVL?.dividedBy(totalTVL || 0)


  const successfull = useSelector(selectIsTransactionSuccessfull(TransactionTypes.launch));
  const loading = useSelector(selectIsTransactionLoading(TransactionTypes.launch));
  const collectivesLoading = useSelector(selectCollectivesLoading)

  function onLaunch() {
    dispatch(setTransactionType(TransactionTypes.launch));
    void dispatch(launchCollectiveThunk());
  }


  useEffect(() => {
    if (successfull && started && !collectivesLoading) {
      history.push(`/collective-launched?address=${proxy}`);
    }
  }, [successfull, started, collectivesLoading, history, proxy]);

  return (
    <Box display="flex" gap="12px" mt={5}>
      <Box flex="1" p={1.5} css={styles.wrapperBlue}>
        <Box>
          <Typography variant="labsSmall" color="text.secondary">
            TVL Confirmed by participants
          </Typography>
        </Box>
        <Typography mt={1} variant="h2" color="#0288D1">
          TVL ${formatNumber(approvedTVL)}
        </Typography>
        <Typography mt={1} mb={2} variant="body1" color="#0288D1">
          {formatPct(pct)}
        </Typography>
        <Typography variant="labsSmall" color="text.secondary">
          Liquidity that participants have confirmed will be automatically
          deposited at launch.
        </Typography>
      </Box>
      <Box flex="1" p={1.5} css={styles.wrapper}>
        <Typography variant="labsSmall" color="text.secondary">
          Vesting Schedule
        </Typography>
        <Typography mt={0.5} variant="body1">
          Duration: {endDate} months
        </Typography>
        <Typography mt={0.5} variant="body1">
          Cliff: {cliffDate} months
        </Typography>
      </Box>
      <Box flex="1" p={1.5} css={styles.wrapperGrey}>
        <Typography variant="labsSmall" color="text.secondary">
          Launch Collective
        </Typography>
        <Box mt={1} mb={5.2}>
          {loading ? (
            <CircularProgress size={30} />
          ) : (
            <Button
              variant="contained"
              disabled={!canLaunch}
              onClick={onLaunch}
              sx={{ textTransform: "none", height: "30px" }}
            >
              Launch Collective
            </Button>
          )}
        </Box>
        <Typography variant="labsSmall" color="text.secondary">
          Collective will automatically launch when all participants have
          approved.
        </Typography>
      </Box>
    </Box>
  );
}
