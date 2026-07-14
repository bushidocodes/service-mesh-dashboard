import React from "react";
import { IntlProvider } from "react-intl";
import { useAppSelector } from "store/hooks";
import messages from "./messages";
import { flattenMessages } from "./utils/i18n";

interface ConnectedIntlProviderProps {
  children?: React.ReactNode;
}

function ConnectedIntlProvider({ children }: ConnectedIntlProviderProps) {
  const locale = useAppSelector((state) => state.settings.locale);

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

export default ConnectedIntlProvider;
