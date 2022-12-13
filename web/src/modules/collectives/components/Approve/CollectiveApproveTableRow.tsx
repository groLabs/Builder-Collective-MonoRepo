import { Button, Chip, CircularProgress, Typography } from "@mui/material";
import { Box } from "@mui/system";
import BigNumber from "bignumber.js";
import React, { useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { formatNumber, formatPct } from "../../../../utils";
import { useFormatedAddress } from "../../../wallet/hooks/useFormattedAddress";
import { selectWalletAccount } from "../../../wallet/store/wallet.selectors";
import placeholder from "../../../scCreator/assets/placeholder.png";
import { Participant } from "../../../scCreator/store/scCreator.store";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { executeApproveTxnThunk } from "../../store/thunks/executeApproveTxnThunk";
import {
  selectIsTransactionLoading,
  selectIsTransactionSuccessfull,
} from "../../../exchange/store/exchange.selectors";
import { setTransactionType } from "../../../exchange/store/exchange.reducer";
import { TransactionTypes } from "../../../exchange/store/exchange.store";
import { selectTotalTVL } from "../../store/collectives.selectors";

export function CollectiveApproveTableRow({
  participant,
}: {
  participant: Participant & { allocation: BigNumber; approved: boolean };
}): React.ReactElement {
  const wallet = useSelector(selectWalletAccount);

  const dispatch = useDispatch();

  const tvl = useSelector(selectTotalTVL);

  const allocation = useMemo(() => {
    return new BigNumber(participant.value).dividedBy(tvl || 1)
  }, [tvl, participant]);

  const isApproved = useSelector(
    selectIsTransactionSuccessfull(TransactionTypes.approve)
  );

  const isSameAsConnected = useMemo(() => {
    return wallet.toLowerCase() === participant.address.toLowerCase();
  }, [wallet, participant.address]);

  const color = isSameAsConnected ? "#1976D2" : "text.primary";

  const formattedAddress = useFormatedAddress(participant.address);
  const tokenAddress = useFormatedAddress(participant.token);

  const isLoading = useSelector(
    selectIsTransactionLoading(TransactionTypes.approve)
  );

  function onApprove() {
    dispatch(setTransactionType(TransactionTypes.approve));
    dispatch(executeApproveTxnThunk());
  }

  return (
    <Box mb={5} display="flex" gap="16px">
      <Box display="flex" flex="0.4">
        <img
          width="40px"
          height="40px"
          src={placeholder}
          alt="placeholder_img"
        />
        <Box ml={2}>
          <Typography variant="body1">{formattedAddress}</Typography>
          <Typography color="text.secondary" variant="body2Small">
            {participant.name}
          </Typography>
        </Box>
      </Box>
      <Box flex="0.3">
        <Typography variant="body1" textAlign="right" color={color}>
          {tokenAddress}
        </Typography>
      </Box>
      <Box flex="0.3">
        <Typography variant="body1" textAlign="right" color={color}>
          ${formatNumber(new BigNumber(participant.price))}
        </Typography>
      </Box>
      <Box flex="0.3">
        <Typography textAlign="right" variant="body1" color={color}>
          {formatNumber(new BigNumber(participant.amount))}
        </Typography>
      </Box>
      <Box flex="0.3" display="flex" flexDirection="column">
        <Typography variant="body1" textAlign="right" color={color}>
          ${formatNumber(new BigNumber(participant.value))}
        </Typography>
        <Typography
          mt={0.5}
          textAlign="right"
          variant="labsSmall"
          color="text.secondary"
        >
          Allocation: {formatPct(allocation)}
        </Typography>
      </Box>
      <Box flex="0.3" display="flex" justifyContent="flex-end">
        {isSameAsConnected && isLoading && <CircularProgress size={30} />}
        {!isApproved &&
          !isLoading &&
          isSameAsConnected &&
          !participant.approved && (
            <Button
              variant="contained"
              type="submit"
              sx={{ textTransform: "none", height: "30px" }}
              disabled={!isSameAsConnected}
              onClick={onApprove}
            >
              Approve
            </Button>
          )}
        {!isSameAsConnected && !participant.approved && (
          <Button
            variant="contained"
            type="submit"
            sx={{ textTransform: "none", height: "30px" }}
            disabled
            onClick={onApprove}
          >
            Approve
          </Button>
        )}
        {((isApproved && !isLoading && isSameAsConnected) || participant.approved) && (
          <Chip
            label="Approved"
            color="success"
            variant="outlined"
            onDelete={() => {}}
            deleteIcon={<CheckCircleIcon />}
          />
        )}
      </Box>
    </Box>
  );
}
