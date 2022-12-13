import {
  Box,
  Button,
  CircularProgress,
  TextField,
  Typography,
} from "@mui/material";
import React, { useEffect, useMemo, useState } from "react";
import { ReactComponent as WarningIcon } from "../../scCreator/assets/warning.svg";
import { ReactComponent as SandClockIcon } from "../../scCreator/assets/sandclock.svg";
import { css } from "@emotion/react";
import { useDispatch, useSelector } from "react-redux";
import {
  selectLpBalance,
  selectParticipantStaked,
} from "../store/collectives.selectors";
import { formatNumber, formatPct } from "../../../utils";
import { MaskedTextField } from "../../../components/MaskedTextField";
import BigNumber from "bignumber.js";
import { setTransactionType } from "../../exchange/store/exchange.reducer";
import { TransactionTypes } from "../../exchange/store/exchange.store";
import { stakeThunk } from "../store/thunks/stakeLpThunk";
import {
  selectIsTransactionLoading,
  selectIsTransactionSuccessfull,
} from "../../exchange/store/exchange.selectors";
import { BasicModal } from "../../../components/dialogs/BasicModal";

type CustomEvent = React.ChangeEvent<HTMLInputElement> & {
  target: { rawValue: string };
};

export function StakeModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}): React.ReactElement {
  const [action, setAction] = useState("stake");
  const [pct, setPct] = useState("0%");

  const staked = useSelector(selectParticipantStaked);
  const balance = useSelector(selectLpBalance);

  const dispatch = useDispatch();

  const [value, setValue] = useState("");
  const isStake = action === "stake";

  const finalBalance = useMemo(() => {
    return isStake ? balance : staked;
  }, [staked, balance, isStake]);

  const isStakeLoading = useSelector(
    selectIsTransactionLoading(TransactionTypes.stake)
  );

  const isUnstakeLoading = useSelector(
    selectIsTransactionLoading(TransactionTypes.unstake)
  );

  const isStakeConfirmed = useSelector(
    selectIsTransactionSuccessfull(TransactionTypes.stake)
  );

  const isUnstakeConfirmed = useSelector(
    selectIsTransactionSuccessfull(TransactionTypes.unstake)
  );

  useEffect(() => {
    if (isStakeConfirmed || isUnstakeConfirmed) {
      onClose();
    }
  }, [isStakeConfirmed, isUnstakeConfirmed, onClose]);

  function onStake() {
    dispatch(
      setTransactionType(
        isStake ? TransactionTypes.stake : TransactionTypes.unstake
      )
    );
    void dispatch(stakeThunk(new BigNumber(value), isStake));
  }

  function onPctChange(value: string) {
    const val = value.replace("%", "");
    const float = parseFloat(val);
    setPct(isNaN(float) ? "0%" : `${float}%`);
    setValue(finalBalance.multipliedBy(float / 100).toString());
  }

  return (
    <BasicModal open={open} onClose={onClose}>
      <React.Fragment>
        {!isStakeLoading && !isUnstakeLoading ? (
          <Box>
            <Typography variant="h2" mb={0.5} fontWeight="400">
              {isStake ? "Stake" : "Unstake"} your LP tokens
            </Typography>
            <Box display="flex" gap="12px" mt={4}>
              <Box flex="0.7">
                <TextField
                  variant="outlined"
                  label={isStake ? "Stake" : "Unstake"}
                  fullWidth
                  value={value}
                  onChange={(e: CustomEvent) => {
                    setValue(e.target.rawValue);
                    setPct(
                      formatPct(
                        new BigNumber(e.target.rawValue).dividedBy(finalBalance)
                      )
                    );
                  }}
                  InputProps={{
                    inputComponent: MaskedTextField,
                    inputProps: {
                      maxLength: 16,
                      options: {
                        numeral: true,
                        numeralDecimalScale: 2,
                        numeralPositiveOnly: true,
                        numeralThousandsGroupStyle: "thousand",
                        value,
                      },
                    },
                  }}
                />
              </Box>
              <Box flex="0.3">
                <TextField
                  value={pct}
                  variant="outlined"
                  placeholder="0%"
                  fullWidth
                  onChange={(e) => onPctChange(e.target.value)}
                />
              </Box>
            </Box>
            <Box>
              <Typography ml={2} color="text.secondary" variant="labsSmall">
                {isStake ? 'Wallet' : 'Staked'} Balance: {formatNumber(finalBalance)}
              </Typography>
            </Box>
            {isStake && (
              <React.Fragment>
                <Box display="flex" mt={4}>
                  <WarningIcon
                    css={css`
                      width: 35px;
                    `}
                  />
                  <Typography
                    variant="body2Small"
                    color="text.secondary"
                    ml={2}
                  >
                    Only stake LP tokens you want to liquidate. Staked LP token
                    are automatically liquidated into into the maximum amount of
                    vested principal tokens.
                  </Typography>
                </Box>
                <Box display="flex" mt={4}>
                  <SandClockIcon
                    css={css`
                      width: 16px;
                    `}
                  />
                  <Typography
                    variant="body2Small"
                    color="text.secondary"
                    ml={2}
                  >
                    You have to stake LP tokens for time until they can be
                    claimed as principal tokens.
                  </Typography>
                </Box>
              </React.Fragment>
            )}
          </Box>
        ) : (
          <Box display="flex" justifyContent="center" mt={17}>
            <CircularProgress size={112} thickness={3} />
          </Box>
        )}
        <Box>
          <Button
            variant="contained"
            sx={{ textTransform: "none", height: "42px", mb: 1.5 }}
            fullWidth
            disabled={isStakeLoading || isUnstakeLoading}
            onClick={onStake}
          >
            {isStake ? "Stake" : "Unstake"}
          </Button>
          <Button
            variant="outlined"
            color="primary"
            disabled={isStakeLoading || isUnstakeLoading}
            sx={{ textTransform: "none", height: "42px", border: "none" }}
            fullWidth
            onClick={() => setAction(isStake ? "unstake" : "stake")}
          >
            {!isStake ? "Stake" : "Unstake"}
          </Button>
        </Box>
      </React.Fragment>
    </BasicModal>
  );
}
