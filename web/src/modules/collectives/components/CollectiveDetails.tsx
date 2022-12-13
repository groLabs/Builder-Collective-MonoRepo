import { Box, Button, Typography, useTheme } from "@mui/material";
import React from "react";
import { useSelector } from "react-redux";
import { selectCollectiveName} from "../../scCreator/store/scCreator.selectors";
import { useFormatedAddress } from "../../wallet/hooks/useFormattedAddress";
import { useIsApprove } from "../../scCreator/hooks/useIsApprove";
import { css } from "@emotion/react";
import { selectCurrentCollectiveCreationDate, selectCurrentCollectiveManager } from "../store/collectives.selectors";

export function CollectiveDetails(): React.ReactElement {
  const name = useSelector(selectCollectiveName);
  const manager = useSelector(selectCurrentCollectiveManager);
  const date = useSelector(selectCurrentCollectiveCreationDate);
  const formattedAddress = useFormatedAddress(manager);
  const theme = useTheme()

  const isApprove = useIsApprove();

  const styles = {
    button: css`
      color: ${theme.palette.common.black};
      background: ${theme.palette.grey[300]};
      &:hover  {
        color: ${theme.palette.grey[300]};
      }
    `,
  };

  return (
    <Box>
      <Box display="flex" justifyContent="space-between">
        <Box mr={6}>
          <Typography variant="h2" mb={1.5}>
            {name}
          </Typography>
          <Typography variant="labsSmall" color="text.secondary" mb={0.5}>
            Created: {date}
          </Typography>
          <Box>
            <Typography variant="labsSmall" color="text.secondary">
              Manager: {formattedAddress}
            </Typography>
          </Box>
        </Box>

        {isApprove && (
          <Button
            variant="contained"
            type="submit"
            disabled
            sx={{
              textTransform: "none",
              height: "42px",
              ml: 10,
            }}
            css={styles.button}
          >
            Cancel collective
          </Button>
        )}
      </Box>
    </Box>
  );
}
