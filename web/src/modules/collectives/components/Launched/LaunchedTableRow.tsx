import { Box, Button, Typography } from '@mui/material';
import React, { useMemo, useState } from 'react'
import { formatNumber, formatPct } from '../../../../utils';
import { useFormatedAddress } from '../../../wallet/hooks/useFormattedAddress';
import placeholder from "../../../scCreator/assets/placeholder.png";
import { Position } from '../../../scCreator/mocks';
import { css } from '@emotion/react'
import { useSelector } from 'react-redux';
import { selectWalletAccount } from '../../../wallet/store/wallet.selectors';
import { StakeModal } from '../StakeModal';
import { selectTotalTVL } from '../../store/collectives.selectors';
import { ClaimModal } from '../ClaimModal/ClaimModal';

export function LaunchedTableRow({ user }: {user: Position}): React.ReactElement {
  const formattedAddress = useFormatedAddress(user.address);
  const wallet = useSelector(selectWalletAccount)

  const [ openStake, setOpenStake ] = useState(false)
  const [openClaim, setOpenClaim] = useState(false);

  const styles = {
    wrapper: css`
      background: #f5f5f5;
      border-radius: 4px;
    `,
    blue: css`
      background: rgba(25, 118, 210, 0.08);
    `,
  };

  const isSameAsConnected = useMemo(() => {
    return wallet.toLowerCase() === user.address.toLowerCase();
  }, [wallet, user.address]);


  const tvl = useSelector(selectTotalTVL)

  return (
    <Box mb={3.8} display="flex" gap="16px" alignItems="center">
      <Box display="flex" flex="0.3">
        <img
          width="40px"
          height="40px"
          src={placeholder}
          alt="placeholder_img"
        />
        <Box ml={2}>
          <Typography variant="body1">{formattedAddress}</Typography>
          <Typography color="text.secondary" variant="body2Small">
            {user.name}
          </Typography>
        </Box>
      </Box>
      <Box flex="0.3">
        <Box flex="1" display="flex" flexDirection="column">
          <Typography variant="body1" textAlign="right">
            ${formatNumber(user.tvl)}
          </Typography>
          <Typography
            mt={0.5}
            textAlign="right"
            variant="labsSmall"
            color="text.secondary"
          >
            Allocation: {formatPct(user.tvl.dividedBy(tvl!))}
          </Typography>
        </Box>
      </Box>
      <Box flex="0.3">
        <Box flex="1" display="flex" flexDirection="column">
          <Typography variant="body1" textAlign="right">
            ${formatNumber(user.unvested)}
          </Typography>
          <Typography
            mt={0.5}
            textAlign="right"
            variant="labsSmall"
            color="text.secondary"
          >
            TVL: {formatPct(user.unvested.dividedBy(user.tvl))}
          </Typography>
        </Box>
      </Box>
      <Box flex="0.3">
        <Box flex="1" display="flex" flexDirection="column">
          <Typography textAlign="right" variant="body1">
            {formatNumber(user.vested)}
          </Typography>
          <Typography
            mt={0.5}
            textAlign="right"
            variant="labsSmall"
            color="text.secondary"
          >
            TVL: {formatPct(user.vested.dividedBy(user.tvl))}
          </Typography>
        </Box>
      </Box>
      <Box
        flex="0.6"
        display="flex"
        css={
          isSameAsConnected ? [styles.wrapper, styles.blue] : [styles.wrapper]
        }
        p={1.8}
      >
        <Box flex="1" display="flex" flexDirection="column">
          <Typography variant="body1" textAlign="right">
            ${formatNumber(user.staked)}
          </Typography>
          <Typography
            mt={0.5}
            textAlign="right"
            variant="labsSmall"
            color="text.secondary"
          >
            TVL: {formatPct(user.staked.dividedBy(user.tvl))}
          </Typography>
        </Box>
        <Box flex="1" display="flex" justifyContent="flex-end">
          <Box flex="1" display="flex" flexDirection="column">
            <Typography textAlign="right" variant="body1">
              ${formatNumber(user.claimable)}
            </Typography>
            <Typography
              mt={0.5}
              textAlign="right"
              variant="labsSmall"
              color="text.secondary"
            >
              TVL: {formatPct(user.claimable.dividedBy(user.tvl))}
            </Typography>
          </Box>
        </Box>
      </Box>
      <Box
        flex="0.2"
        display="flex"
        flexDirection="column"
        alignItems="flex-end"
      >
        <Button
          variant="contained"
          disabled={!isSameAsConnected}
          size="small"
          sx={{ textTransform: "none", height: "30px", mb: 1 }}
          onClick={() => setOpenStake(true)}
        >
          Stake
        </Button>
        <Button
          variant="contained"
          disabled={!isSameAsConnected}
          size="small"
          sx={{ textTransform: "none", height: "30px" }}
          onClick={() => setOpenClaim(true)}
        >
          Claim
        </Button>
      </Box>
      <StakeModal open={openStake} onClose={() => setOpenStake(false)} />
      <ClaimModal open={openClaim} onClose={() => setOpenClaim(false)} />
    </Box>
  );
}