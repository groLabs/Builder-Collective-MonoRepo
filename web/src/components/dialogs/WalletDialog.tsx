/* eslint-disable @typescript-eslint/no-misused-promises */

import React from "react";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import CloseIcon from "@mui/icons-material/Close";
import {
  Alert,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Grid,
  IconButton,
  Typography,
} from "@mui/material";
import { writeText } from "clipboard-polyfill/text";
import {
  AVALANCHE_NETWORK,
  ETHEREUM_NETWORK,
  etherscanAddressUrl,
} from "../../constants";
import { isCorrectNetwork } from "../../modules/app/app.helpers";
import { useChangeNetwork } from "../../modules/wallet/hooks/useChangeNetwork";
import { useFormatedAddress } from "../../modules/wallet/hooks/useFormattedAddress";
import {
  selectIsAVAXNetwork,
  selectWalletState,
} from "../../modules/wallet/store/wallet.selectors";
import { useSelector } from "react-redux";

type PpWalletDialog = {
  currentAccount: string;
  onClose: () => void;
  open: boolean;
};

export function WalletDialog({
  currentAccount,
  onClose,
  open,
}: PpWalletDialog): React.ReactElement {
  const alertColor = "text.secondary";
  const walletState = useSelector(selectWalletState);
  const isWrongNetwork =
    !isCorrectNetwork(walletState.networkId) && walletState.networkId;
  const isAvax = useSelector(selectIsAVAXNetwork);
  const { onClickDisconnect } = useChangeNetwork({});

  const isMobileDisplay = false
  const isXsSize = false

  const formattedAddress = useFormatedAddress(currentAccount);

  async function onDisconnect(): Promise<void> {
    onClose();
    await onClickDisconnect();
  }

  function implementTitleCase(name: string): string {
    return name
      .split(/\s+/u)
      .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  }

  return (
    <Dialog
      disableScrollLock
      fullWidth
      aria-describedby="alert-dialog-description"
      aria-labelledby="alert-dialog-title"
      fullScreen={isXsSize}
      open={open}
      PaperProps={{
        style: {
          overflow: "hidden",
        },
      }}
      onClose={onClose}
    >
      <IconButton
        sx={{ m: 1, position: "absolute", right: 0, top: 0 }}
        onClick={onClose}
      >
        <CloseIcon />
      </IconButton>
      <DialogTitle color="text.secondary" id="alert-dialog-title">Wallet</DialogTitle>
      <Box>
        <DialogContent
          sx={{ my: isMobileDisplay ? 0 : 2, px: isMobileDisplay ? 2 : 4 }}
        >
          <DialogContentText id="alert-dialog-description">
            <Box
              pb={0}
              px={4}
              sx={{
                border: 1,
                borderColor: alertColor,
                borderRadius: 1,
              }}
            >
              <Grid container alignItems="center" spacing={2}>
                <Grid item xs={6}>
                  <Alert
                    icon={
                      <AccountBalanceWalletIcon sx={{ color: alertColor }} />
                    }
                    severity="info"
                    sx={{ backgroundColor: "inherit" }}
                  >
                    <Typography align="left" color={alertColor} variant="body2">
                      {formattedAddress}
                    </Typography>
                  </Alert>
                </Grid>
                {!isWrongNetwork ? (
                  <Grid item xs={6}>
                    <Typography
                      align="right"
                      color={alertColor}
                      variant="body2"
                    >
                      {implementTitleCase(
                        isAvax ? AVALANCHE_NETWORK : ETHEREUM_NETWORK
                      )}
                    </Typography>
                  </Grid>
                ) : (
                  <Grid item xs={6} />
                )}
              </Grid>
            </Box>
          </DialogContentText>
          <DialogActions sx={{ px: isMobileDisplay ? 0 : "auto" }}>
            <Grid container>
              <Grid item>
                <Button
                  onClick={(): Promise<void> => writeText(currentAccount)}
                >
                  <Typography variant="body2" color="text.secondary">
                    Copy address
                  </Typography>
                </Button>
              </Grid>
              <Grid item>
                <Button
                  component="a"
                  href={etherscanAddressUrl(currentAccount, isAvax)}
                  rel="noopener noreferrer nofollow"
                  target="_blank"
                >
                  <Typography variant="body2" color="text.secondary">
                    {isAvax ? "Snowtrace" : "Etherscan"}
                  </Typography>
                </Button>
              </Grid>
              <Grid item>
                <Button onClick={onDisconnect}>
                  <Typography variant="body2" color="text.secondary">
                    Disconnect
                  </Typography>
                </Button>
              </Grid>
            </Grid>
          </DialogActions>
        </DialogContent>
      </Box>
      {/* <Box pb={0} px={isMobileDisplay ? 2 : 4}>
        <Typography component="h2" mb={2} variant="h2">
          Transaction History
        </Typography>

        {isWrongNetwork && (
          <Box pb={5}>
            <Alert severity="warning">
              Please Connect to {implementTitleCase(ETHEREUM_NETWORK)} to view
              your transaction history
            </Alert>
          </Box>
        )}
      </Box> */}
    </Dialog>
  );
}
