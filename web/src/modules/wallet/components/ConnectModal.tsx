/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-misused-promises */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable func-style */
import React, { memo, useEffect, useMemo, useState } from "react";
import { css } from "@emotion/react";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import { Box, CircularProgress, Typography, useTheme } from "@mui/material";
import argentLogo from "../assets/argent-simple.svg";
import coinbaseLogo from "../assets/coinbase.svg";
import ledgerLogo from "../assets/ledger.svg";
import metamaskLogo from "../assets/metamask.svg";
import trezorLogo from "../assets/trezor.svg";
import walletconnectLogo from "../assets/walletconnect.svg";
import { GroModal, GroModalHeader } from "../../../components/GroModal";
import { orange } from "../../../theme/palette";
import { Status } from "../../app/app.types";
import { PROVIDERS } from "../../app/providers.constants";
import { web3Provider } from "../../app/services";
import {
  getCoinbaseWalletProvider,
  getLedgerProvider,
  getStoredMetamaskProvider,
  getTrezorProvider,
  getWalletConnectProvider,
} from "../../app/services/providers.service";
import { connectProviderThunk } from "../store/thunks/connectProviderThunk";
import {
  clearValues,
  setConnectWalletModalOpened,
  setWalletStatus,
} from "../store/wallet.reducers";
import {
  selectProviderName,
  selectWalletAccount,
  selectWalletError,
  selectWalletState,
} from "../store/wallet.selectors";
import { useDispatch, useSelector } from "react-redux";

const LEDGER_NOT_CONNECTED = "Wallet not connected";

// eslint-disable-next-line react/display-name
export const ConnectModal = memo(() => {
  const dispatch = useDispatch();
  const { isModalOpened } = useSelector(selectWalletState);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const account = useSelector(selectWalletAccount);
  const provider = useSelector(selectProviderName);
  const walletError = useSelector(selectWalletError);

  const redirectURL = useMemo(() => {
    const currentURL = window.location.href
      .replace("http://", "")
      .replace("https://", "");
    const mobileURL = `https://metamask.app.link/dapp/${currentURL}`;
    const desktopURL = "https://metamask.io";
    if (
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/iu.test(
        navigator.userAgent
      )
    ) {
      return mobileURL;
    }
    return desktopURL;
  }, []);

  useEffect(() => {
    if (!isModalOpened) {
      setLoading(false);
      setError(false);
      dispatch(clearValues());
    }
  }, [isModalOpened, dispatch]);

  const onClose = (): void => {
    dispatch(setConnectWalletModalOpened(false));
  };

  useEffect(() => {
    if (account) {
      setLoading(false);
      setError(false);
      onClose();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [account]);

  useEffect(() => {
    if (provider === PROVIDERS.TREZOR && walletError === "Popup closed") {
      setLoading(false);
      setError(true);
    }
    if (
      provider === PROVIDERS.LEDGER &&
      walletError &&
      walletError !== LEDGER_NOT_CONNECTED
    ) {
      setLoading(false);
      setError(true);
    }
  }, [provider, walletError]);

  const theme = useTheme();
  const styles = {
    errorWrapper: css`
      border-radius: 5px;
      border: 1px solid ${orange[300]};
    `,
    itemWrapper: css`
      background: ${theme.palette.grey[100]};
      border: 1px solid ${theme.palette.grey[600]};
      border-radius: 8px;
      height: 52px;
      &:hover {
        background: ${theme.palette.grey[800]};
        color: ${theme.palette.grey[100]};
      }
    `,
    pointer: css`
      cursor: pointer;
    `,
  };

  async function onClickConnectMetamask(): Promise<void> {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
    // await web3Provider.request({ method: ‘eth_requestAccounts’ });
    setError(false);
    setLoading(true);
    const metamask = await getStoredMetamaskProvider();
    if (metamask) {
      dispatch(connectProviderThunk(metamask.provider, PROVIDERS.METAMASK));
      // window.location.reload();
      setLoading(false);
      onClose();
    } else {
      setLoading(false);
      setError(true);
    }
  }

  async function onClickConnectWalletConnect(
    isArgent?: boolean
  ): Promise<void> {
    setError(false);
    setLoading(true);
    const walletConnect = await getWalletConnectProvider(isArgent);

    if (walletConnect) {
      dispatch(
        connectProviderThunk(walletConnect.provider, PROVIDERS.WALLETCONNECT)
      );
      setLoading(false);
      onClose();
    } else {
      setError(true);
      setLoading(false);
    }
  }

  async function onClickConnectCoinbaseWallet(): Promise<void> {
    setError(false);
    setLoading(true);
    const coinbase = await getCoinbaseWalletProvider();

    if (coinbase) {
      dispatch(connectProviderThunk(coinbase.provider, PROVIDERS.COINBASE));
      setLoading(false);
      onClose();
    } else {
      setError(true);
      setLoading(false);
    }
  }

  async function onClickConnectLedgerWaller(): Promise<void> {
    setError(false);
    setLoading(true);
    dispatch(setWalletStatus({ status: Status.ready }));

    const ledger = await getLedgerProvider();

    if (ledger) {
      dispatch(
        connectProviderThunk(ledger.provider, PROVIDERS.LEDGER, ledger.account)
      );
    } else {
      setError(true);
      setLoading(false);
    }
  }

  async function onClickConnectTrezorWallet(): Promise<void> {
    setError(false);
    setLoading(true);

    const trezor = await getTrezorProvider();

    if (trezor) {
      dispatch(connectProviderThunk(trezor.provider, PROVIDERS.TREZOR));
    } else {
      setError(true);
      setLoading(false);
    }
  }

  return (
    <GroModal
      isOpen={isModalOpened}
      overflow="auto"
      width="472px"
      onClose={onClose}
    >
      <Box pb={7} pt={4.5} px={5}>
        <GroModalHeader
          title={
            <Box>
              <Typography variant="h2">
                Connect wallet
              </Typography>
            </Box>
          }
          onClose={onClose}
        />
        {error && !loading && (
          <Box css={styles.errorWrapper} display="flex" mb={5} mt={3} p={2}>
            <WarningAmberIcon sx={{ color: orange[300] }} />
            <Box ml={2} pr={3}>
              <Typography variant="body2">
                Connection failed. Please try connecting again.
              </Typography>
            </Box>
          </Box>
        )}
        {loading && (
          <Box
            alignItems="center"
            display="flex"
            flexDirection="column"
            mb={20}
            mt={16}
          >
            <CircularProgress color="secondary" size={80} thickness={2} />
            <Typography mt={4} variant="h4">
              Connecting wallet...
            </Typography>
          </Box>
        )}
        {!loading && (
          <React.Fragment>
            <Typography variant="body2">
              Select your wallet to use Gro Protocol
            </Typography>
            {web3Provider ? (
              <Box
                alignItems="center"
                css={[styles.itemWrapper, styles.pointer]}
                data-testid="connect-metamask"
                display="flex"
                justifyContent="space-between"
                mb={1.5}
                mt={3}
                px={2.5}
                py={1.5}
                onClick={onClickConnectMetamask}
              >
                <Typography variant="h4">MetaMask</Typography>
                <img
                  loading="lazy"
                  alt=""
                  src={metamaskLogo}
                  width={28}
                  height={28}
                />
              </Box>
            ) : (
              <a
                href={redirectURL}
                rel="noreferrer"
                style={{ color: "white", textDecoration: "none" }}
                target="_blank"
                title="Get MetaMask"
              >
                <Box
                  alignItems="center"
                  css={[styles.itemWrapper, styles.pointer]}
                  display="flex"
                  justifyContent="space-between"
                  my={1.5}
                  px={2.5}
                  py={1.5}
                  onClick={onClickConnectMetamask}
                >
                  <Typography variant="h4">MetaMask</Typography>
                  <img
                    loading="lazy"
                    alt=""
                    src={metamaskLogo}
                    width={28}
                    height={28}
                  />
                </Box>
              </a>
            )}
            <Box
              alignItems="center"
              css={[styles.itemWrapper, styles.pointer]}
              display="flex"
              justifyContent="space-between"
              my={1.5}
              px={2.5}
              py={1.5}
              onClick={(): Promise<void> => onClickConnectWalletConnect()}
            >
              <Typography variant="h4">WalletConnect</Typography>
              <img loading="lazy" alt="" src={walletconnectLogo} width={18} />
            </Box>
            <Box
              alignItems="center"
              css={[styles.itemWrapper, styles.pointer]}
              display="flex"
              justifyContent="space-between"
              my={1.5}
              px={2.5}
              py={1.5}
              onClick={(): Promise<void> => onClickConnectWalletConnect(true)}
            >
              <Typography variant="h4">Argent</Typography>
              <img
                loading="lazy"
                alt=""
                src={argentLogo}
                width={28}
                height={26}
              />
            </Box>
            <Box
              alignItems="center"
              css={[styles.itemWrapper, styles.pointer]}
              display="flex"
              justifyContent="space-between"
              my={1.5}
              px={2.5}
              py={1.5}
              height={28}
              onClick={onClickConnectCoinbaseWallet}
            >
              <Typography variant="h4">Coinbase Wallet</Typography>
              <img loading="lazy" alt="" src={coinbaseLogo} width={28} />
            </Box>
            <Box display="flex" gap="0px 12px">
              <Box
                alignItems="center"
                css={[styles.itemWrapper, styles.pointer]}
                display="flex"
                flex="1"
                justifyContent="space-between"
                mb={1.5}
                px={2.5}
                py={1.5}
                onClick={onClickConnectLedgerWaller}
              >
                <Typography variant="h4">Ledger</Typography>
                <img
                  loading="lazy"
                  alt=""
                  src={ledgerLogo}
                  width={28}
                  height={28}
                />
              </Box>
              <Box
                alignItems="center"
                css={[styles.itemWrapper, styles.pointer]}
                display="flex"
                flex="1"
                justifyContent="space-between"
                mb={1.5}
                px={2.5}
                py={1.5}
                onClick={onClickConnectTrezorWallet}
              >
                <Typography variant="h4">Trezor</Typography>
                <img
                  loading="lazy"
                  alt=""
                  src={trezorLogo}
                  width={20}
                  height={27}
                />
              </Box>
            </Box>
          </React.Fragment>
        )}
      </Box>
    </GroModal>
  );
});
