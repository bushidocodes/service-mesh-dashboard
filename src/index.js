import React from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { HashRouter } from "react-router-dom";
import { addLocaleData } from "react-intl";

import AppContainer from "./components/AppContainer";
import AppHeader from "./components/AppHeader";
import AppFooter from "./components/Footer";
import Notification from "./components/Notification";
import ConnectedIntlProvider from "./ConnectedIntlProvider";
import Main from "./components/Main";
import store from "./store";
import "./services";
import { GlobalFontStyles } from "./style/styleVariables";

import de from "react-intl/locale-data/de";
import en from "react-intl/locale-data/en";
import es from "react-intl/locale-data/es";

// Add locale data for our supported locales
addLocaleData([...de, ...en, ...es]);

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
