import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  Typography,
} from "@mui/material";
import React, { useEffect } from "react";
import { ReactComponent as ThumbsUpIcon } from "../assets/thumbsup.svg";
import { ReactComponent as WarningIcon } from "../assets/warning.svg";
import { css } from "@emotion/react";
import { useHistory } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { initializeCollectiveThunk } from "../store/thunks/initializeCollectiveThunk";
import { setTransactionType } from "../../exchange/store/exchange.reducer";
import { TransactionTypes } from "../../exchange/store/exchange.store";
import {
  selectIsTransactionLoading,
  selectIsTransactionSuccessfull,
} from "../../exchange/store/exchange.selectors";
import { selectCollectivesLoading, selectLatestCollectiveAddress } from "../../collectives/store/collectives.selectors";

export function InitializeCollective({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}): React.ReactElement {
  const dispatch = useDispatch()

  const history = useHistory();

  const latestProxy = useSelector(selectLatestCollectiveAddress)

  const loading = useSelector(selectIsTransactionLoading(TransactionTypes.initialize));
  const collectiveListLoading = useSelector(selectCollectivesLoading);
  const confirmed = useSelector(selectIsTransactionSuccessfull(TransactionTypes.initialize));

  useEffect(() => {
    if (confirmed && !collectiveListLoading) {
      history.push(`/collective-approve?address=${latestProxy}`);
    }
  }, [confirmed, latestProxy, collectiveListLoading]);

  function onInitialize() {
    dispatch(setTransactionType(TransactionTypes.initialize));
    dispatch(initializeCollectiveThunk())
  }

  return (
    <Dialog open={open} onClose={onClose}>
      <Box width="400px" height="596px" p={3}>
        <Box
          display="flex"
          flexDirection="column"
          justifyContent="space-between"
          height="83%"
        >
          <Box>
            <Typography variant="h2" mb={0.5} fontWeight="400">
              {loading ? "Initializing collective..." : "Are you all Aligned?"}
            </Typography>
            {!loading ? (
              <React.Fragment>
                <Box display="flex" mt={4}>
                  <WarningIcon />
                  <Typography variant="body2Small" color="text.secondary" ml={2}>
                    No changes can be made to the collective once you
                    initialize.
                  </Typography>
                </Box>
                <Box display="flex" mt={4}>
                  <ThumbsUpIcon
                    css={css`
                      width: 32px;
                    `}
                  />
                  <Typography variant="body2Small" color="text.secondary" ml={2}>
                    Make sure you have aligned and agreed on the collective
                    details with other participants before you initialize.
                  </Typography>
                </Box>
              </React.Fragment>
            ) : (
              <Box display="flex" justifyContent="center" mt={17}>
                <CircularProgress size={112} thickness={3} />
              </Box>
            )}
          </Box>
        </Box>
        <Box>
          <Button
            variant="contained"
            sx={{ textTransform: "none", height: "42px", mb: 1.5 }}
            fullWidth
            onClick={onInitialize}
            disabled={loading}
          >
            Yes, we are aligned
          </Button>
          <Button
            variant="outlined"
            color="primary"
            sx={{ textTransform: "none", height: "42px", border: "none" }}
            fullWidth
            onClick={onClose}
            disabled={loading}
          >
            Nope, we are not aligned
          </Button>
        </Box>
      </Box>
    </Dialog>
  );
}
