import React, { useState } from "react";
import { useSelector } from "react-redux";
import { css } from "@emotion/react";
import { Typography, useTheme, Button } from "@mui/material";
import { ConnectWalletButton } from "../../modules/wallet/components/ConnectWalletButton";
import { useFormatedAddress } from "../../modules/wallet/hooks/useFormattedAddress";
import { selectWalletAccount } from "../../modules/wallet/store/wallet.selectors";
import { WalletDialog } from "../dialogs";

export function ConnectWallet(): React.ReactElement {
  const [openWalletDialog, setOpenWalletDialog] = useState(false);
  const account = useSelector(selectWalletAccount);

  const formattedAddress = useFormatedAddress(account);

  const theme = useTheme();

  const styles = {
    container: css`
      margin: 0;
      text-align: center;
      button {
        padding-top: 10px;
        padding-bottom: 10px;
        @media (max-width: 600px) {
          padding: ${account ? 0 : theme.spacing(0.5, 1)};
          border-radius: 8px;
        }
      }
      @media (min-width: ${theme.breakpoints.values.lg}px) {
        margin: ${theme.spacing(0, account ? 0 : 1.5, 0)};
      }
    `,
  };
  return (
    <div css={styles.container}>
      {account ? (
        <React.Fragment>
          <Button onClick={(): void => setOpenWalletDialog(true)}>
            <Typography noWrap data-testid="wallet-address" variant="nav">
              {formattedAddress}
            </Typography>
          </Button>

          <WalletDialog
            currentAccount={account}
            open={openWalletDialog}
            onClose={(): void => setOpenWalletDialog(false)}
          />
        </React.Fragment>
      ) : (
        <ConnectWalletButton fullWidth />
      )}
    </div>
  );
}
