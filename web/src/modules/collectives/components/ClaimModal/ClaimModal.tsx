import { Box, Button, CircularProgress, Typography } from "@mui/material";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { BasicModal } from "../../../../components/dialogs/BasicModal";
import { formatNumber } from "../../../../utils";
import {
  selectAllClaimableDollar,
  selectCurrentUserClaimable,
} from "../../store/collectives.selectors";
import { updateClaimableThunk } from "../../store/thunks/updateClaimableThunk";
import { setTransactionType } from "../../../exchange/store/exchange.reducer";
import {
  selectIsTransactionLoading,
  selectIsTransactionSuccessfull,
} from "../../../exchange/store/exchange.selectors";
import { TransactionTypes } from "../../../exchange/store/exchange.store";
import { claimLpThunk } from "../../store/thunks/claimLpThunk";
import { ClaimableToken } from "./ClaimableToken";

export function ClaimModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}): React.ReactElement {
  const claimable = useSelector(selectCurrentUserClaimable);
  const totalClaimableDollars = useSelector(selectAllClaimableDollar);
  const dispatch = useDispatch();

  function onClaim() {
    dispatch(setTransactionType(TransactionTypes.claim));
    void dispatch(claimLpThunk());
  }

  const isClaimLoading = useSelector(
    selectIsTransactionLoading(TransactionTypes.claim)
  );

  const isClaimConfirmed = useSelector(
    selectIsTransactionSuccessfull(TransactionTypes.claim)
  );

  useEffect(() => {
    dispatch(updateClaimableThunk())
  }, [dispatch])

  useEffect(() => {
    if(isClaimConfirmed) {
      onClose()
    }
  }, [isClaimConfirmed, onClose])

  return (
    <BasicModal open={open} onClose={onClose}>
      <React.Fragment>
        <Box>
          <Typography variant="h2" mb={0.5} fontWeight="400">
            Claimable tokens
          </Typography>
          <Typography variant="body2Small" color="text.secondary">
            When claiming, you can only claim 100% of claimable tokens at once.
          </Typography>
          {!isClaimLoading ? (
            <Box>
              <Typography mt={4} mb={2} variant="h6">
                Claim all: ${formatNumber(totalClaimableDollars)}
              </Typography>
              {(claimable || []).map((elem) => (
                <ClaimableToken elem={elem} key={`claimable-${elem.address}`} />
              ))}
            </Box>
          ) : (
            <Box display="flex" justifyContent="center" mt={17}>
              <CircularProgress size={112} thickness={3} />
            </Box>
          )}
        </Box>

        <Box>
          <Button
            variant="contained"
            sx={{ textTransform: "none", height: "42px", mb: 1.5 }}
            fullWidth
            onClick={onClaim}
            disabled={isClaimLoading}
          >
            Claim all
          </Button>
        </Box>
      </React.Fragment>
    </BasicModal>
  );
}
