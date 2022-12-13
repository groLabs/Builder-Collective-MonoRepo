import { Typography } from '@mui/material';
import BigNumber from 'bignumber.js';
import React from 'react'
import { formatNumber } from '../../../../utils';
import { useFormatedAddress } from '../../../wallet/hooks/useFormattedAddress';

export function ClaimableToken({elem}: { elem: { address: string, value: BigNumber}}): React.ReactElement {
      const address = useFormatedAddress(elem.address);

    return (
      <Typography
        variant="body1"
        color="text.secondary"
        key={`claimable-${elem.address}`}
        mb={1}
      >
        {address}: {formatNumber(elem.value)}
      </Typography>
    );
}