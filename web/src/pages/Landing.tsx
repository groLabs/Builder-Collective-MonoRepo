import React from "react";
import { CenteredWrapper } from "../components";
import { css } from "@emotion/react";
import { Typography, Box, Button } from "@mui/material";
import { useHistory } from "react-router";
import background from "../modules/scCreator/assets/background.png";

function Landing(): React.ReactElement {
  const history = useHistory();

  const styles = {
    wrapper: css`
      background: linear-gradient(
        150.76deg,
        #c751ff 15.4%,
        #ff8b66 83.87%,
        #ffc881 134.82%
      );
      border-radius: 24px;
      width: 100%;
      height: 486px;
    `,
    content: css`
      background: #ffffff;
      border-radius: 24px;
      width: 100%;
      height: 480px;
    `,
    title: css`
      background: -webkit-linear-gradient(
        101.43deg,
        #c751ff 2.5%,
        #ff8b66 58.68%,
        #ffc881 100.49%
      );
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    `,
    background: css`
      background: url(${background});
      background-size: cover;
    `,
  };

  function onLaunch() {
    history.push('/dashboard')
  }

  return (
    <Box css={styles.background}>
      <CenteredWrapper>
        <Box pb={14}>
          <Box
            css={styles.wrapper}
            px={21}
            display="flex"
            flexDirection="column"
            justifyContent="center"
          >
            <Box>
              <Typography
                textAlign="center"
                color="white"
                variant="body1"
                fontSize="34px"
              >
                Collectives for web3 builders to share knowledge and financial
                upside.
              </Typography>
            </Box>
            <Box display="flex" justifyContent="center" mt={5}>
              <Button
                variant="contained"
                color="secondary"
                onClick={onLaunch}
                sx={{ textTransform: "none", height: "34px", width: "263px" }}
              >
                Launch app
              </Button>
            </Box>
          </Box>

          <Box
            css={styles.content}
            mt={5}
            px={11.5}
            display="flex"
            alignItems="center"
          >
            <Box display="flex" gap="76px">
              <Box>
                <Typography
                  css={styles.title}
                  mb={4}
                  variant="body1"
                  fontSize="34px"
                >
                  For VCs
                </Typography>
                <Button
                  variant="contained"
                  onClick={onLaunch}
                  sx={{ textTransform: "none", height: "42px", width: "164px" }}
                >
                  Create collective
                </Button>
              </Box>
              <Box>
                <Box mb={3}>
                  <Typography sx={{ opacity: 0.7 }} mb={0.5} variant="h6">
                    Turbo-charge portfolio collaboration
                  </Typography>
                  <Typography variant="body2Small" color="text.secondary">
                    Create stronger bonds between portfolio companies and
                    incentivise them to support each other.
                  </Typography>
                </Box>
                <Box mb={3}>
                  <Typography sx={{ opacity: 0.7 }} mb={0.5} variant="h6">
                    Turnkey solution to deliver unique value
                  </Typography>
                  <Typography variant="body2Small" color="text.secondary">
                    A tool to easily facilitate deeper relationships between
                    portfolio siblings.
                  </Typography>
                </Box>
                <Box>
                  <Typography sx={{ opacity: 0.7 }} mb={0.5} variant="h6">
                    Let teams partly derisk through portfolio exposure
                  </Typography>
                  <Typography variant="body2Small" color="text.secondary">
                    Let teams partly derisk their net worth concentration
                    through your portfolio instead of secondary share sales.
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Box>
          <Box
            css={styles.content}
            mt={5}
            px={11.5}
            display="flex"
            alignItems="center"
          >
            <Box display="flex" gap="40px">
              <Box width="220px">
                <Typography
                  css={styles.title}
                  mb={4}
                  variant="body1"
                  fontSize="34px"
                >
                  For Builders
                </Typography>
                <Button
                  variant="contained"
                  sx={{ textTransform: "none", height: "42px", width: "164px" }}
                  onClick={onLaunch}
                >
                  Create collective
                </Button>
              </Box>
              <Box>
                <Box mb={3}>
                  <Typography sx={{ opacity: 0.7 }} mb={0.5} variant="h6">
                    Collaborate closer with peers
                  </Typography>
                  <Typography variant="body2Small" sx={{ opacity: 0.5 }}>
                    Establish closer ties to peer builders so you can grow
                    stronger together and share in each others’ success.
                  </Typography>
                </Box>
                <Box mb={3}>
                  <Typography sx={{ opacity: 0.7 }} mb={0.5} variant="h6">
                    Derisk your net worth concentration
                  </Typography>
                  <Typography variant="body2Small" sx={{ opacity: 0.5 }}>
                    A tool to easily facilitate deeper relationships between
                    portfolio siblings.
                  </Typography>
                </Box>
                <Box mb={3}>
                  <Typography sx={{ opacity: 0.7 }} mb={0.5} variant="h6">
                    Get access to liquidity earlier
                  </Typography>
                  <Typography variant="body2Small" sx={{ opacity: 0.5 }}>
                    Liquify and make your future tokens composable within a
                    tokenized portfolio of peers.
                  </Typography>
                </Box>
                <Box>
                  <Typography sx={{ opacity: 0.7 }} mb={0.5} variant="h6">
                    Increase utility of unvested tokens
                  </Typography>
                  <Typography variant="body2Small" sx={{ opacity: 0.5 }}>
                    Make vesting project tokens composable within a tokenized
                    portfolio.
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Box>
        </Box>
      </CenteredWrapper>
    </Box>
  );
}

export default Landing
