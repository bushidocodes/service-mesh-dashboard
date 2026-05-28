import React from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { HashRouter } from "react-router-dom";

import AppContainer from "./components/AppContainer";
import AppHeader from "./components/AppHeader";
import AppFooter from "./components/Footer";
import Notification from "./components/Notification";
import ConnectedIntlProvider from "./ConnectedIntlProvider";
import Main from "./components/Main";
import store from "./store";
import "./services";
import { GlobalFontStyles } from "./style/styleVariables";

// react-intl v3+ uses native Intl APIs (Node 13+, all modern browsers),
// so the addLocaleData() shim and react-intl/locale-data/* imports that
// were required in v2 have been removed. The browser/runtime now ships
// the locale data this app needs.

const root = createRoot(document.getElementById("root"));
root.render(
  <Provider store={store}>
    <ConnectedIntlProvider>
      <HashRouter>
        <AppContainer>
          <GlobalFontStyles />
          <Notification />
          <AppHeader />
          <Main />
          <AppFooter />
        </AppContainer>
      </HashRouter>
    </ConnectedIntlProvider>
  </Provider>
);
