import {
  Box,
  Button,
  FormControl,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  TextField,
  Typography,
} from "@mui/material";
import React, { useMemo, useState } from "react";
import { css } from "@emotion/react";
import { useDispatch } from "react-redux";
import { setCliffStore, setEndStore } from "../store/scCreator.reducer";
import { BasicModal } from "../../../components/dialogs/BasicModal";

export function AddVestingDates({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}): React.ReactElement {
  const dispatch = useDispatch();
  const [cliff, setCliff] = useState<string | null>(null);
  const [end, setEnd] = useState<string | null>(null);

  const isValid = useMemo(() => {
    return cliff && end;
  }, [cliff, end]);

  function onSubmit() {
    if (isValid) {
      dispatch(setCliffStore(cliff || ""));
      dispatch(setEndStore(end || ""));
      onClose();
    }
  }

  return (
    <BasicModal open={open} onClose={onClose}>
      <React.Fragment>
        <Box>
          <Typography variant="h2" mb={0.5} fontWeight="400">
            Vesting schedule
          </Typography>
          <Typography variant="body2Small" color="text.secondary">
            Collectives vesting linearly until your chosen end date. Set the
            collectives vesting schedule cliff and end dates.
          </Typography>
          <Box mt={3.5}>
            <TextField
              variant="outlined"
              fullWidth
              label="Vesting start date"
              defaultValue="Same as launch date"
              focused
              InputProps={{ readOnly: true }}
              css={css`
                & input {
                  color: gray !important;
                }
                & label {
                  color: gray !important;
                }
                & fieldset {
                  border: 1px solid gray !important;
                }
              `}
            />
          </Box>
          <Box mt={4}>
            <Box>
              <FormControl fullWidth>
                <InputLabel htmlFor="outlined-adornment-amount">
                  Vesting duration
                </InputLabel>
                <OutlinedInput
                  id="outlined-adornment-amount"
                  type="number"
                  value={end}
                  onChange={(e) => setEnd(e.target.value)}
                  startAdornment={
                    <InputAdornment position="start">Months</InputAdornment>
                  }
                  label="Vesting duration"
                />
              </FormControl>
            </Box>
            {!end && end !== null && (
              <Typography variant="navSub" color="red">
                This field is required
              </Typography>
            )}
          </Box>
          <Box mt={4}>
            <FormControl fullWidth>
              <InputLabel htmlFor="outlined-adornment-amount">
                Vesting cliff
              </InputLabel>
              <OutlinedInput
                id="outlined-adornment-amount"
                type="number"
                value={cliff}
                onChange={(e) => setCliff(e.target.value)}
                startAdornment={
                  <InputAdornment position="start">Months</InputAdornment>
                }
                label="Vesting cliff"
              />
            </FormControl>
            {!cliff && end !== null && (
              <Typography variant="navSub" color="red">
                This field is required
              </Typography>
            )}
          </Box>
        </Box>
        <Button
          variant="contained"
          type="submit"
          sx={{ textTransform: "none", height: "42px" }}
          fullWidth
          onClick={onSubmit}
        >
          Done
        </Button>
      </React.Fragment>
    </BasicModal>
  );
}
