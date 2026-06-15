import React from "react";
import { IntlProvider, createIntl, createIntlCache } from "react-intl";
import { Provider } from "react-redux";
import { render } from "@testing-library/react";

import { flattenMessages } from "utils/i18n";
import messages from "messages";

/**
 * Test helpers for components that consume react-intl.
 *
 * Components using react-intl need access to the `intl` object, which
 * `useIntl()`/`injectIntl` read from the nearest `<IntlProvider>` in the React
 * tree. These helpers wrap an English-locale intl context (and optionally a
 * redux store) around a node so it can be rendered with React Testing Library.
 *
 * Migrated from enzyme to RTL (issue #46): there is no shallow vs. mount split
 * in RTL, so `mountWithIntl` is now an alias of `renderWithIntl`. Tests that
 * previously called `wrapper.setProps({...})` use RTL's `rerender` instead,
 * passing a freshly wrapped element via `withIntl(<Component {...newProps} />)`.
 */

const localeMessages = flattenMessages(messages["en-US"]);
const intlConfig = { locale: "en-US", messages: localeMessages };

// A standalone intl instance for the rare test that injects `intl` as a direct
// prop (e.g. when exercising an unconnected component that expects it).
const cache = createIntlCache();
export const intl = createIntl(intlConfig, cache);

/**
 * Wrap a node in `<IntlProvider>` (and a redux `<Provider>` when a store is
 * given). Exposed so tests can build the element passed to RTL's `rerender`.
 *
 * @param {React.ReactElement} node
 * @param {object} [store] optional redux store
 * @returns {React.ReactElement}
 */
export function withIntl(node: React.ReactNode, store: any = null) {
  const tree = <IntlProvider {...intlConfig}>{node}</IntlProvider>;
  return store ? <Provider store={store}>{tree}</Provider> : tree;
}

/**
 * Render a node inside an intl (and optional redux) context with RTL.
 * Returns the standard RTL result ({ container, asFragment, rerender, ... }).
 *
 * @param {React.ReactElement} node
 * @param {object} [store] optional redux store
 * @returns {import("@testing-library/react").RenderResult}
 */
export function renderWithIntl(node: React.ReactNode, store: any = null) {
  return render(withIntl(node, store));
}

// In RTL there is no shallow/mount distinction; keep the name for call sites.
export const mountWithIntl = renderWithIntl;
