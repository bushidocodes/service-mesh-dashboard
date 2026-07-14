import React from "react";
import { IntlProvider } from "react-intl";
import { MemoryRouter } from "react-router-dom";

import { flattenMessages } from "../src/utils/i18n";
import messages from "../src/messages";

const LOCALES = ["en-US", "es-ES", "de-DE"];
const getMessages = (locale) => flattenMessages(messages[locale]);

/**
 * Global decorators that replace the old storybook-addon-intl and
 * storybook-router packages:
 *
 * - `withIntl` wraps every story in <IntlProvider>, exposing a `locale`
 *   toolbar control so stories can be previewed in any supported locale.
 * - `withRouter` wraps every story in <MemoryRouter>, so components that
 *   call react-router hooks (useNavigate, useParams, etc.) don't blow up.
 *
 * Decorators run outer-to-inner in the order Storybook applies them
 * (last in the array is innermost). We want router OUTSIDE intl so intl
 * messages can be used inside routed components, which means router goes
 * first in the array.
 */
const withRouter = (Story) => (
  <MemoryRouter>
    <Story />
  </MemoryRouter>
);

const withIntl = (Story, context) => {
  const locale = context.globals.locale || "en-US";
  return (
    <IntlProvider key={locale} locale={locale} messages={getMessages(locale)}>
      <Story />
    </IntlProvider>
  );
};

export const decorators = [withRouter, withIntl];

export const globalTypes = {
  locale: {
    name: "Locale",
    description: "Internationalization locale",
    defaultValue: "en-US",
    toolbar: {
      icon: "globe",
      items: LOCALES.map((value) => ({ value, title: value })),
      showName: true
    }
  }
};

export const parameters = {
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/
    }
  }
};
