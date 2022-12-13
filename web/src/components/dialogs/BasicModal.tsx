import { Box, Dialog } from "@mui/material";
import React from "react";

export function BasicModal({
  open,
  onClose,
  children
}: {
  open: boolean;
  onClose: () => void;
  children: React.ReactElement
}): React.ReactElement {
  return (
    <Dialog open={open} onClose={onClose} disableScrollLock>
      <Box width="400px" height="596px" p={3}>
        <Box
          display="flex"
          flexDirection="column"
          justifyContent="space-between"
          height="100%"
        >
            {children}
        </Box>
      </Box>
    </Dialog>
  );
}
