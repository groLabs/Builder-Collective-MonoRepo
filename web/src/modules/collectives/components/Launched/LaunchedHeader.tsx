import { Box, Typography } from '@mui/material'
import React from 'react'
import { css } from '@emotion/react'
import { useSelector } from 'react-redux';
import { selecCollectiveDates, selectTotalParticipants, selectTotalTVL } from '../../store/collectives.selectors';
import { formatNumber } from '../../../../utils';

export function LaunchedHeader(): React.ReactElement {
    const styles = {
      wrapper: css`
        border: 1px solid #0288d1;
        border-radius: 12px;
        height: 180px;
      `,
      grey: css`
        border: 1px solid rgba(0, 0, 0, 0.3);
      `,
    };

    const totalTVL = useSelector(selectTotalTVL)

    const dates = useSelector(selecCollectiveDates);

    const participants = useSelector(selectTotalParticipants);


    return (
      <Box display="flex" gap="12px" mt={5}>
        <Box flex="1" p={1.5} css={styles.wrapper}>
          <Box mb={2}>
            <Typography variant="labsSmall" color="text.secondary">
              Combined TVL
            </Typography>
          </Box>
          <Typography mb={0.5} variant="h2" color="#0288D1">
            TVL ${formatNumber(totalTVL)}
          </Typography>
          <Typography variant="body1" color="#0288D1">
            {participants} Participants
          </Typography>
        </Box>
        <Box flex="1" p={1.5} css={[styles.wrapper, styles.grey]}>
          <Box mb={2}>
            <Typography variant="labsSmall" color="text.secondary">
              Vesting Schedule
            </Typography>
          </Box>
          <Typography variant="body1" mb={0.5}>
            Start: {dates.start}
          </Typography>
          <Typography variant="body1" mb={0.5}>
            Cliff: {dates.cliff} 
          </Typography>
          <Typography variant="body1">End: {dates.end}</Typography>
        </Box>
      </Box>
    );
}