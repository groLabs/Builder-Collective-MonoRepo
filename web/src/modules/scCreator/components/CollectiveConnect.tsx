import { Box, Typography } from '@mui/material'
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { ConnectWalletButton } from '../../wallet/components/ConnectWalletButton'
import { selectWalletAccount } from '../../wallet/store/wallet.selectors';
import { setGenerator } from '../store/scCreator.reducer';

export function CollectiveConnect({setStep}: { setStep: (val: string) => void}): React.ReactElement {
  const wallet = useSelector(selectWalletAccount);
  const dispatch = useDispatch()

  useEffect(() => {
    if(!!wallet) {
      dispatch(setGenerator(wallet))
      setStep('second')
    }
  }, [ wallet, setStep, dispatch ])


    return (
        <Box
        display="flex"
        flexDirection="column"
        justifyContent="space-between"
        height="95%"
      >
        <Box>
          <Typography variant="h2" mb={0.5} fontWeight="400">
            Connect Wallet
          </Typography>
        </Box>
        <ConnectWalletButton />
      </Box>
    )
}