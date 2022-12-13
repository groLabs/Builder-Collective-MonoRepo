import { Box, Button, CircularProgress, Typography } from "@mui/material";
import React, { useEffect } from "react";
import { useHistory } from "react-router";

export function BuildingCollective(): React.ReactElement {

  const history = useHistory()

  useEffect(() => {
    setTimeout(() => {
      history.push("/collective");
    }, 3000);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="space-between"
      height="95%"
    >
      <Box>
        <Typography variant="h2" mb={0.5} fontWeight="400">
          Building collective...
        </Typography>
        <Box display="flex" justifyContent="center" mt={17}>

        <CircularProgress size={112} thickness={3} />
        </Box>
      </Box>
      <Button
        variant="contained"
        type="submit"
        disabled
        sx={{ textTransform: "none", height: "42px" }}
        fullWidth
      >
        Create collective
      </Button>
    </Box>
  );
}
