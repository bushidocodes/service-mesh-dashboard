import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { Router } from "react-router-dom";
import { addLocaleData } from "react-intl";

import history from "./AppHistory";
import AppContainer from "./components/AppContainer";
import AppHeader from "./components/AppHeader";
import AppFooter from "./components/Footer";
import Notification from "./components/Notification";
import ConnectedIntlProvider from "./ConnectedIntlProvider";
import Main from "./components/Main";
import store from "./store";
import "./services";

import de from "react-intl/locale-data/de";
import en from "react-intl/locale-data/en";
import es from "react-intl/locale-data/es";

// Add locale data for our supported locales
addLocaleData([...de, ...en, ...es]);

ReactDOM.render(
  <Provider store={store}>
    <ConnectedIntlProvider>
      <Router history={history}>
        <AppContainer>
          <Notification />
          <AppHeader />
          <Main />
          <AppFooter />
        </AppContainer>
      </Router>
    </ConnectedIntlProvider>
  </Provider>,
  document.getElementById("root")
);
