import { Box, Button, Typography } from "@mui/material";
import React, { useMemo, useState } from "react";
import { css } from "@emotion/react";
import BigNumber from "bignumber.js";
import { formatNumber } from "../../../../utils";
import { AddVestingDates } from "../AddVestingDates";
import { useDispatch, useSelector } from "react-redux";
import { selectCliffDate, selectEndDate } from "../../store/scCreator.selectors";
import { InitializeCollective } from "../InitializeCollective";
import { launchCollectiveThunk } from "../../../collectives/store/thunks/launchCollectiveThunk";

export function CollectiveHeader({
  tvl,
  disabled,
}: {
  tvl: BigNumber;
  disabled: boolean;
}): React.ReactElement {
  const styles = {
    wrapper: css`
      border-radius: 12px;
      background: rgba(25, 118, 210, 0.08);
    `,
    green: css`
      border-radius: 12px;
      border: 1px solid #4caf50;
    `,
    disabledWrapper: css`
      background: #f5f5f5;
      border-radius: 12px;
    `,
    pill: css`
      border: 1px solid rgba(46, 125, 50, 0.5);
      border-radius: 16px;
    `,
  };
  const dispatch = useDispatch()
  const [openDates, setOpenDates] = useState(false);
  const [openInitialize, setOpenInitialize] = useState(false);


  const cliffDate = useSelector(selectCliffDate);
  const endDate = useSelector(selectEndDate);

  function onLaunch() {
    dispatch(launchCollectiveThunk())
  }

  const hasDates = useMemo(() => {
    return !!(cliffDate && endDate);
  }, [cliffDate, endDate]);

  return (
    <Box display="flex" gap="12px" mt={5}>
      <Box flex="1" p={1.5} css={disabled ? styles.wrapper : styles.green}>
        <Box>
          <Typography color="text.secondary" variant="labsSmall">
            Step 1:
          </Typography>
        </Box>
        <Typography
          variant="h6"
          my={1}
          color={!disabled ? "#4CAF50" : "#1976D2"}
        >
          TVL ${formatNumber(tvl)}
        </Typography>
        <Box>
          <Typography variant="labsSmall" color="text.secondary">
            Below, add the amount of funds participants need to deposit into the
            collective.
          </Typography>
        </Box>
      </Box>
      <Box
        flex="1"
        p={1.5}
        css={
          disabled
            ? styles.disabledWrapper
            : hasDates
            ? styles.green
            : styles.wrapper
        }
      >
        <Box mb={1}>
          <Typography variant="labsSmall" color="text.secondary">
            Step 2:
          </Typography>
        </Box>
        {!hasDates || disabled ? (
          <React.Fragment>
            <Button
              variant="contained"
              sx={{ textTransform: "none", height: "30px" }}
              disabled={disabled || tvl.isEqualTo(0)}
              size="small"
              onClick={() => setOpenDates(true)}
            >
              Add vesting dates
            </Button>
            <Box mt={1}>
              <Typography variant="labsSmall" color="text.secondary">
                Set the collectives vesting schedule cliff and end dates.
              </Typography>
            </Box>{" "}
          </React.Fragment>
        ) : (
          <Box>
            <Typography variant="body1" my={1} color="#2E7D32">
              Duration: {endDate} months
            </Typography>
            <Typography variant="body1" my={1} color="#2E7D32">
              Cliff: {cliffDate} months
            </Typography>
          </Box>
        )}
      </Box>
      <Box
        flex="1"
        p={1.5}
        css={hasDates && !disabled ? styles.wrapper : styles.disabledWrapper}
      >
        <Box mb={1}>
          <Typography variant="labsSmall" color="text.secondary">
            Step 3:
          </Typography>
        </Box>
        <Button
          variant="contained"
          sx={{ textTransform: "none", height: "30px" }}
          disabled={!hasDates || disabled}
          size="small"
          type="submit"
          onClick={() => setOpenInitialize(true)}
        >
          Initialize Collective
        </Button>
        <Box mt={1}>
          <Typography variant="labsSmall" color="text.secondary">
            Lock in all collective details; participants, tokens, prices and
            amounts.
          </Typography>
        </Box>
      </Box>
      <Box flex="1" p={1.5} css={styles.disabledWrapper}>
        <Box mb={1}>
          <Typography variant="labsSmall" color="text.secondary">
            Step 4:
          </Typography>
        </Box>
        <Button
          variant="contained"
          sx={{ textTransform: "none", height: "30px" }}
          disabled
          onClick={onLaunch}
          size="small"
        >
          Launch Collective
        </Button>
        <Box mt={1}>
          <Typography variant="labsSmall" color="text.secondary">
            Collective will automatically launch when all participants have
            confirmed.
          </Typography>
        </Box>
      </Box>
      <AddVestingDates open={openDates} onClose={() => setOpenDates(false)} />
      <InitializeCollective
        open={openInitialize}
        onClose={() => setOpenInitialize(false)}
      />
    </Box>
  );
}
