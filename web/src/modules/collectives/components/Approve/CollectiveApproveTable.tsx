import { Box, Divider, Typography } from '@mui/material';
import BigNumber from 'bignumber.js';
import React from 'react'
import { useSelector } from 'react-redux';
import { selectCurrentCollective } from "../../store/collectives.selectors";
import { Participant } from "../../../scCreator/store/scCreator.store";
import { CollectiveApproveTableRow } from './CollectiveApproveTableRow';

type ParticipantTvl = Participant & {
    allocation: BigNumber
    approved: boolean
}

export function CollectiveApproveTable(): React.ReactElement {

    const collective = useSelector(selectCurrentCollective)


    return (
      <Box mt={5}>
        <Box display="flex">
          <Box flex="0.37">
            <Typography variant="body2" color="text.secondary">
              Participants
            </Typography>
          </Box>
          <Box flex="0.3">
            <Typography textAlign="right" variant="body2" color="text.secondary">
              Token address
            </Typography>
          </Box>
          <Box flex="0.3">
            <Typography textAlign="right" variant="body2" color="text.secondary">
              Token price
            </Typography>
          </Box>
          <Box flex="0.3">
            <Typography textAlign="right" variant="body2" color="text.secondary">
              Token amount
            </Typography>
          </Box>
          <Box flex="0.3">
            <Typography textAlign="right" variant="body2" color="text.secondary">
              Value locked
            </Typography>
          </Box>
          <Box flex="0.3">
            <Typography textAlign="right" variant="body2" color="text.secondary">
              Status
            </Typography>
          </Box>
        </Box>
        <Divider sx={{ borderColor: "#D9D9D9", mt: 2, mb: 4 }} />
        {(collective?.participants || []).map((participant) => (
          <CollectiveApproveTableRow
            key={participant.name}
            participant={participant as ParticipantTvl}
          />
        ))}
      </Box>
    );
}