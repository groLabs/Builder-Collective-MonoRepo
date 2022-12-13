import { Divider, Typography } from '@mui/material';
import { Box } from '@mui/system'
import React from 'react'
import { useSelector } from 'react-redux';
import { selectLaunchedCollectiveParticipants } from '../../store/collectives.selectors';
import { LaunchedTableRow } from './LaunchedTableRow';

export function LaunchedTable(): React.ReactElement {
  const launchedParticipants = useSelector(selectLaunchedCollectiveParticipants)
    return (
      <Box mt={5}>
        <Box display="flex">
          <Box flex="0.3">
            <Typography variant="body2" color="text.secondary">
              Participants
            </Typography>
          </Box>
          <Box flex="0.3">
            <Typography
              textAlign="center"
              variant="body2"
              color="text.secondary"
            >
              TVL
            </Typography>
          </Box>
          <Box flex="0.3">
            <Typography
              textAlign="center"
              variant="body2"
              color="text.secondary"
            >
              1.Unvested
            </Typography>
          </Box>
          <Box flex="0.3">
            <Typography
              textAlign="center"
              variant="body2"
              color="text.secondary"
            >
              2.Vested
            </Typography>
          </Box>
          <Box flex="0.3">
            <Typography
              textAlign="center"
              variant="body2"
              color="text.secondary"
            >
              3.Staked
            </Typography>
          </Box>
          <Box flex="0.3" mr={10}>
            <Typography
              textAlign="center"
              variant="body2"
              color="text.secondary"
            >
              4.Claimable
            </Typography>
          </Box>
        </Box>
        <Divider sx={{ borderColor: "#D9D9D9", mt: 2, mb: 4 }} />
        {(launchedParticipants || []).map((user) => (
          <LaunchedTableRow key={user.address} user={user} />
        ))}
      </Box>
    );
}