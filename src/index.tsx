import isPropValid from "@emotion/is-prop-valid";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { HashRouter } from "react-router-dom";
import { StyleSheetManager } from "styled-components";
import ConnectedIntlProvider from "./ConnectedIntlProvider";
import AppContainer from "./components/AppContainer";
import AppHeader from "./components/AppHeader";
import AppFooter from "./components/Footer";
import Main from "./components/Main";
import Notification from "./components/Notification";
import store from "./store";
import "./services";
import { GlobalFontStyles } from "./style/styleVariables";

// react-intl v3+ uses native Intl APIs (Node 13+, all modern browsers),
// so the addLocaleData() shim and react-intl/locale-data/* imports that
// were required in v2 have been removed. The browser/runtime now ships
// the locale data this app needs.

// The #root element is statically present in index.html, so this is never null.
const root = createRoot(document.getElementById("root")!);
root.render(
  <Provider store={store}>
    <ConnectedIntlProvider>
      <StyleSheetManager
        shouldForwardProp={(prop, target) =>
          typeof target === "string" ? isPropValid(prop) : true
        }
      >
        <HashRouter
          {...({
            future: { v7_startTransition: true, v7_relativeSplatPath: true }
          } as any)}
        >
          <AppContainer>
            <GlobalFontStyles />
            <Notification />
            <AppHeader />
            <Main />
            <AppFooter />
          </AppContainer>
        </HashRouter>
      </StyleSheetManager>
    </ConnectedIntlProvider>
  </Provider>
);
