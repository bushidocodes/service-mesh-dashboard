// Based on https://hackernoon.com/testing-react-components-with-jest-and-enzyme-41d592c174f
// import "babel-polyfill";
import Enzyme, { shallow, render, mount } from "enzyme";
import Adapter from "@cfaester/enzyme-adapter-react-18";
// React 18 Enzyme adapter
Enzyme.configure({ adapter: new Adapter() });
// Make Enzyme functions available in all test files without importing
// Fail tests on any warning
console.error = (message, ...args) => {
  // Normalize message to a string whether it's a string, Error, or format arg
  const msg =
    typeof message === "string"
      ? message
      : message instanceof Error
        ? message.message
        : String(message);
  // React Router v6 uses useLayoutEffect internally, which fires a benign SSR
  // warning when enzyme's render() calls renderToStaticMarkup. Suppress it.
  if (msg.includes("useLayoutEffect")) return;
  // React 16/18 warns when a state update (e.g. setSearchParams inside withUrlState)
  // is triggered outside of act(). Enzyme does not automatically wrap prop calls
  // in act(), so this fires in every test that calls setUrlState directly. The
  // assertions still work correctly; this is purely a testing-methodology warning.
  if (msg.includes("not wrapped in act")) return;
  // react-redux v5 and react-intl v2 use the legacy contextTypes / childContextTypes
  // APIs which React 18 warns about. These libraries are intentionally pinned here
  // and will be upgraded in future PRs. Suppress until then.
  if (msg.includes("legacy contextTypes API")) return;
  if (msg.includes("childContextTypes")) return;
  // React 18 deprecates string refs. Notification.js was converted to createRef
  // but third-party libs (react-notification-system) may still trigger this.
  if (msg.includes("string ref")) return;
  // react-select@1, react-collapse, react-motion use deprecated lifecycle methods.
  // Suppress until those libraries are upgraded.
  if (msg.includes("componentWillMount")) return;
  if (msg.includes("componentWillReceiveProps")) return;
  if (msg.includes("componentWillUpdate")) return;
  // react-motion, react-input-range use findDOMNode which React 18 deprecated.
  if (msg.includes("findDOMNode")) return;
  // Some pinned libraries declare defaultProps on function components (deprecated
  // in React 18). Suppress until those libraries are upgraded.
  if (
    msg.includes(
      "Support for defaultProps will be removed from function components"
    )
  )
    return;
  throw new Error(message);
};
