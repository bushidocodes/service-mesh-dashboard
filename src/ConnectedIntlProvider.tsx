import React from "react";
import { IntlProvider } from "react-intl";
import { connect } from "react-redux";
import type { RootState } from "types";

import { flattenMessages } from "./utils/i18n";
import messages from "./messages";

interface ConnectedIntlProviderProps {
  children?: React.ReactNode;
  locale: string;
}

function ConnectedIntlProvider({
  locale,
  children
}: ConnectedIntlProviderProps) {
  return (
    <IntlProvider
      locale={locale}
      key={locale} // this key is important because forces React to create a new instance and re-render the whole DOM tree when the locale changes
      messages={flattenMessages((messages as Record<string, any>)[locale])}
    >
      {children}
    </IntlProvider>
  );
}

function mapStateToProps(state: RootState) {
  return {
    locale: state.settings.locale
  };
}

export default connect(mapStateToProps)(ConnectedIntlProvider);
