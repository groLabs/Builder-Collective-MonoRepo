import React, { Suspense, lazy } from "react";
import { Loading } from "./components";
import { Route, Switch } from "react-router-dom";
import { AppGlobalStyles } from "./theme/AppGlobalStyles";
import { ConnectModal } from "./modules/wallet/components/ConnectModal";
import { Box } from "@mui/material";
import { css } from "@emotion/react";
import { Header } from "./components/Header";

const Dashboard = lazy(() => import("./pages/Dashboard"));
const Landing = lazy(() => import("./pages/Landing"));
const CollectiveLaunched = lazy(() => import("./pages/CollectiveLaunched"));
const CollectiveConfig = lazy(() => import("./pages/CollectiveConfig"));
const CollectiveApprove = lazy(() => import("./pages/CollectiveApprove"));

function App() {
  // useWeb3();

  const styles = {
    margin: css`
      padding-top: 35px;
      position: relative;
      /* overflow: hidden; */
      /* height: 100vh; */
    `,
  };

  return (
    <React.Fragment>
      <AppGlobalStyles />
      <Box>
        <Suspense fallback={<Loading fullScreen />}>
          <Header />
          <Box css={styles.margin}>
            <Switch>
              <Route path="/collective-launched">
                <CollectiveLaunched />
              </Route>
              <Route path="/collective-approve">
                <CollectiveApprove />
              </Route>
              <Route path="/collective">
                <CollectiveConfig />
              </Route>
              <Route path="/dashboard">
                <Dashboard />
              </Route>
              <Route path="/">
                <Landing />
              </Route>
            </Switch>
          </Box>
        </Suspense>
      </Box>
      <ConnectModal />
    </React.Fragment>
  );
}

export default App;
