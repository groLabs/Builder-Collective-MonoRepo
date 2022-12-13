import React from "react";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { createRoot } from "react-dom/client";
import { HashRouter } from "react-router-dom";
import { ThemeProvider } from "@mui/material";
import { themeGro } from "./theme";
import WebFont from "webfontloader";
import { Provider } from "react-redux";
import { store } from "./modules/app/store";

WebFont.load({
  google: {
    families: ["Roboto:100,300,400,500,700,900"],
  },
});

const container = document.getElementById("root");
const root = createRoot(container!);
root.render(
  <Provider store={store}>
    <HashRouter>
      <ThemeProvider theme={themeGro}>
        <App />
      </ThemeProvider>
    </HashRouter>
  </Provider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
