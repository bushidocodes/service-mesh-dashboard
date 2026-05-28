import React from "react";
import { flushSync } from "react-dom";
import { IntlProvider, createIntl, createIntlCache } from "react-intl";
import { Provider } from "react-redux";
import { mount, shallow, render } from "enzyme";

import { flattenMessages } from "utils/i18n";
import messages from "messages";

/**
 * Components using react-intl require access to the `intl` object — either
 * via the IntlProvider context (preferred) or as a direct prop when the
 * component is wrapped with `injectIntl`. These helpers wrap an
 * English-locale intl context around a node for tests.
 *
 * Updated for react-intl v7: the v2-era trick of `new IntlProvider({...})`
 * + `getChildContext()` is gone (legacy contextTypes API was removed in
 * v3), so we use `createIntl()` for shallow tests (where we can't rely on
 * context) and a real `<IntlProvider>` wrapper for mount/render tests.
 *
 * `mountWithIntl` returns the enzyme wrapper with `setProps` and `props`
 * patched to operate on the *inner* component rather than the IntlProvider
 * wrapper, so existing tests that do `wrapper.setProps({...})` and
 * `wrapper.props()` keep working.
 */

const localeMessages = flattenMessages(messages["en-US"]);
const intlConfig = { locale: "en-US", messages: localeMessages };

const cache = createIntlCache();
const intl = createIntl(intlConfig, cache);

/**
 * Shallow render targeting the unwrapped component. In react-intl v7 the
 * `injectIntl` HOC calls `useIntl()` internally, which throws without an
 * IntlProvider in the React tree — and shallow rendering doesn't provide
 * one. To keep existing `shallowWithIntl(<Wrapped />).dive()` call sites
 * working, we substitute the HOC's `WrappedComponent` (the original class
 * component) before shallow rendering. The result is the same as shallow-
 * rendering the inner component with intl injected as a direct prop —
 * which is exactly what `.dive()` was reaching for.
 *
 * Tests written for v2 still call `.dive()` after this; that dive becomes
 * a no-op on a class component but is harmless, so no test changes needed.
 */
export function shallowWithIntl(node) {
  const Inner = node.type.WrappedComponent || node.type;
  const innerNode = React.createElement(Inner, { ...node.props, intl });
  // Existing tests written for react-intl v2 typically do
  //   shallowWithIntl(<Wrapped />).dive()
  // where the .dive() was needed to step past the InjectIntl HOC and land
  // on the inner component's rendered output. Since this helper already
  // bypasses the HOC (by substituting WrappedComponent above), the dive
  // becomes redundant — but the old tests still call it. Patch .dive() to
  // be a no-op so those tests keep working without modification.
  const wrapper = shallow(innerNode);
  wrapper.dive = () => wrapper;
  return wrapper;
}

/**
 * Stateful host that renders the test target inside <IntlProvider> with
 * props sourced from React state, so a ref to this instance can update
 * the inner component's props at runtime without re-mounting.
 */
class IntlTestHost extends React.Component {
  state = { innerProps: this.props.initialProps };

  updateProps = (newProps) => {
    this.setState((prev) => ({
      innerProps: { ...prev.innerProps, ...newProps }
    }));
  };

  render() {
    const { Inner, store } = this.props;
    const node = (
      <IntlProvider {...intlConfig}>
        <Inner {...this.state.innerProps} />
      </IntlProvider>
    );
    return store ? <Provider store={store}>{node}</Provider> : node;
  }
}

function mountWithHost(node, store) {
  const Inner = node.type;
  const hostRef = React.createRef();
  const wrapper = mount(
    <IntlTestHost
      ref={hostRef}
      Inner={Inner}
      initialProps={node.props}
      store={store}
    />
  );
  // Patch setProps to apply to the inner component via the host's state.
  // The original wrapper.setProps targets IntlTestHost itself, which is
  // unhelpful — tests want to update the props of the component under test.
  // flushSync ensures the state update is applied synchronously (React 18
  // concurrent mode otherwise defers it past wrapper.update()).
  wrapper.setProps = (newProps) => {
    flushSync(() => {
      hostRef.current.updateProps(newProps);
    });
    wrapper.update();
    return wrapper;
  };
  // Patch props() to return the inner component's actual props.
  wrapper.props = () => wrapper.find(Inner).first().props();
  return wrapper;
}

export function mountWithIntl(node, store = null) {
  return mountWithHost(node, store);
}

export function renderWithIntl(node, store = null) {
  const tree = <IntlProvider {...intlConfig}>{node}</IntlProvider>;
  return render(store ? <Provider store={store}>{tree}</Provider> : tree);
}
