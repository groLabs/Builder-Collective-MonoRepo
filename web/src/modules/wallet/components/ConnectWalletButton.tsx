import React from "react";
import { Button, Box } from "@mui/material";
import { setConnectWalletModalOpened } from "../store/wallet.reducers";
import {
  selectHardwareWalletLoading,
  selectHasWalletConnected,
  selectWalletLoading,
} from "../store/wallet.selectors";
import { useDispatch, useSelector } from "react-redux";

export function ConnectWalletButton({
  fullWidth = false,
  size = "medium",
}: {
  fullWidth?: boolean;
  size?: "small" | "medium" | "large" | undefined;
}): React.ReactElement | null {
  const dispatch = useDispatch();
  const isConnected = useSelector(selectHasWalletConnected);
  const isWalletLoading = useSelector(selectWalletLoading);
  const hardwareWalletLoading = useSelector(selectHardwareWalletLoading);


  function onClickConnect(): void {
    dispatch(setConnectWalletModalOpened(true));
  }

  return (
    <Box display="flex" justifyContent="center">
      <Button
        data-testid="connect-wallet"
        size={size}
        disabled={isConnected || isWalletLoading || hardwareWalletLoading}
        variant="contained"
        onClick={onClickConnect}
        fullWidth
        sx={{ textTransform: "none", height: "42px" }}
      >
        Connect Wallet
      </Button>
    </Box>
  );
}
