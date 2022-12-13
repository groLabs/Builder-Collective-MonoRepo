import { Box, Chip, Typography } from "@mui/material";
import React from "react";
import { useSelector } from "react-redux";
import { useHistory } from "react-router";
import { ConnectWalletButton } from "../modules/wallet/components/ConnectWalletButton";
import { useFormatedAddress } from "../modules/wallet/hooks/useFormattedAddress";
import { selectWalletAccount } from "../modules/wallet/store/wallet.selectors";

export function Header(): React.ReactElement {
  const wallet = useSelector(selectWalletAccount)

  const history = useHistory()
  const address = useFormatedAddress(wallet);

  return (
    <Box px={4} mt={4} display="flex" justifyContent="space-between" alignItems="center">
      <Typography sx={{cursor: 'pointer'}} onClick={() => history.push('/dashboard')} variant="h2" fontWeight="800">
        Gro Together
      </Typography>
      {!wallet && (
        <ConnectWalletButton />
      )}
      {wallet && (
        <Chip label={address} variant="outlined" color="info" />
      )}
    </Box>
  );
}
