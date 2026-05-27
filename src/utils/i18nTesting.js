import React from "react";
import { IntlProvider, intlShape } from "react-intl";
import { Provider } from "react-redux";
import { mount, shallow, render } from "enzyme";

import { flattenMessages } from "utils/i18n";
import messages from "messages";

/**
 * Components using the react-intl module require access to the intl context.
 * This is not available when mounting single components in Enzyme.
 * These helper functions aim to address that and wrap a valid,
 * English-locale intl context around them.
 *
 * These helper functions were taken from the egghead course on testing
 * with react-intl:
 * https://github.com/damonbauer/egghead-bookshelf/blob/lesson10-testing/src/intl-enzyme.js
 */

// Create the IntlProvider to retrieve context for wrapping around.
const intlProvider = new IntlProvider(
  {
    locale: "en-US",
    messages: flattenMessages(messages["en-US"])
  },
  {}
);

const { intl } = intlProvider.getChildContext();

/**
 * When using React-Intl `injectIntl` on components, props.intl is required.
 */
function nodeWithIntlProp(node) {
  return React.cloneElement(node, { intl });
}

export function shallowWithIntl(node) {
  return shallow(nodeWithIntlProp(node), { context: { intl } });
}

export function mountWithIntl(node, store = null) {
  if (store) {
    return mount(<Provider store={store}>{nodeWithIntlProp(node)}</Provider>, {
      context: { intl },
      childContextTypes: { intl: intlShape }
    });
  }
  return mount(nodeWithIntlProp(node), {
    context: { intl },
    childContextTypes: { intl: intlShape }
  });
}

export function renderWithIntl(node, store = null) {
  if (store) {
    return render(<Provider store={store}>{nodeWithIntlProp(node)}</Provider>, {
      context: { intl },
      childContextTypes: { intl: intlShape }
    });
  }
  return render(nodeWithIntlProp(node), {
    context: { intl },
    childContextTypes: { intl: intlShape }
  });
}
