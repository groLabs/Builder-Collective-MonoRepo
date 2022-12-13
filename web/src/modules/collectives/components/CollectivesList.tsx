import { Box, Divider, Typography } from "@mui/material";
import BigNumber from "bignumber.js";
import React from "react";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router";
import { formatNumber } from "../../../utils";
import { setSelectedCollective } from "../store/collectives.reducer";
import { css } from '@emotion/react'
import placeholder from "../../scCreator/assets/placeholder.png";

export function CollectivesList({
  tvl,
  title,
  list,
  mt
}: {
  tvl: BigNumber;
  title: string;
  mt: number;
  list: {
    proxy: string;
    started: boolean;
    participants: number;
    tvl: BigNumber,
    tokens: number
  }[]
}): React.ReactElement {
  const history = useHistory();
  const dispatch = useDispatch()

  const styles = {
    hover: css`
      cursor: pointer;
      &:hover {
        background: rgba(0, 0, 0, 0.1);
      }
    `,
  };

  function onSelect(address: string, started: boolean) {
    dispatch(setSelectedCollective(address));
    history.push(
      started
        ? `/collective-launched?address=${address}`
        : `/collective-approve?address=${address}`
    );
  }
  return (
    <Box mt={mt}>
      <Box display="flex" justifyContent="space-between" p={2}>
        <Box>
          <Typography variant="h6" lineHeight="24px">
            {title}
          </Typography>
        </Box>
        <Box display="flex" flexDirection="column" alignItems="flex-end">
          <Typography variant="h6" lineHeight="24px">
            ${formatNumber(tvl, 0)}
          </Typography>
        </Box>
      </Box>
      <Divider sx={{ borderColor: "#D9D9D9", mt: 0.5 }} />
      {list.map((elem, key) => (
        <Box
          onClick={() => onSelect(elem.proxy, elem.started)}
          css={styles.hover}
          display="flex"
          justifyContent="space-between"
          key={`${title}-${key}`}
          p={2}
        >
          <Box display="flex">
            <img src={placeholder} alt="placeholder_img" />
            <Box ml={2}>
              <Typography variant="body2" fontWeight="400" lineHeight="24px">
                Collective name
              </Typography>
              <Typography variant="body2Small" color="text.secondary">
                Participants: {elem.participants}
              </Typography>
            </Box>
          </Box>
          <Box display="flex" flexDirection="column" alignItems="flex-end">
            <Typography variant="body2" fontWeight="400" lineHeight="24px">
              ${formatNumber(elem.tvl)}
            </Typography>
            <Typography variant="body2Small" color="text.secondary">
              {elem.tokens} tokens
            </Typography>
          </Box>
        </Box>
      ))}
    </Box>
  );
}
