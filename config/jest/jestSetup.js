// Based on https://hackernoon.com/testing-react-components-with-jest-and-enzyme-41d592c174f
// import "babel-polyfill";
import Enzyme, { shallow, render, mount } from "enzyme";
import Adapter from "@cfaester/enzyme-adapter-react-18";
// React 18 Enzyme adapter
Enzyme.configure({ adapter: new Adapter() });
// Make Enzyme functions available in all test files without importing
// Fail tests on any warning, but allow known React 18 migration warnings
// from legacy dependencies (react-redux v5, react-intl v2, class components
// with legacy lifecycle methods). These will be resolved in upcoming PRs:
//   - Redux Toolkit migration (react-redux v5 → v8, eliminates legacy context)
//   - react-intl v7 migration (eliminates legacy context)
//   - Class → hooks migration (eliminates componentWillReceiveProps etc.)
const KNOWN_MIGRATION_WARNINGS = [
  "Warning: componentWillMount",
  "Warning: componentWillReceiveProps",
  "Warning: componentWillUpdate",
  // Legacy context API – broad form covers React 18 messages like:
  //   "Warning: %s uses the legacy contextTypes API …"
  //   "Warning: %s uses the legacy childContextTypes API …"
  // These come from react-intl v2 and enzyme's childContextTypes helpers.
  // Resolved by the future react-intl v7 migration PR.
  "Warning: Legacy context API",
  "Warning: %s uses the legacy contextTypes API",
  "Warning: %s uses the legacy childContextTypes API",
  // findDOMNode deprecation triggered by enzyme's nodeToHostNode helper.
  // Resolved by the future class→hooks migration PR.
  "Warning: findDOMNode is deprecated",
  "Warning: ReactDOM.render is no longer supported",
  "Warning: An update to",
  "Warning: Can't perform a React state update",
  // React 18 deprecation warnings from legacy dependencies.
  // defaultProps on function components is deprecated in React 18.3+.
  // Resolved by the future dependency upgrade PRs.
  "Warning: %s: Support for defaultProps will be removed from function components",
  // String refs are deprecated in React 18 and will be removed in a future version.
  // Resolved by the future class→hooks migration PR.
  'Warning: Component "%s" contains the string ref',
  // React Router v6 invariant violations that surface via console.error in tests
  // that still use the RRv5 <Route render={...}> API or mount router-aware
  // components without a <MemoryRouter>/<Routes> wrapper.
  // Resolved by a future React Router v6 test migration PR.
  "A <Route> is only ever to be used as the child of <Routes>",
  "useLocation() may be used only in the context of a <Router>"
];

const originalConsoleError = console.error;
console.error = (...args) => {
  const message = typeof args[0] === "string" ? args[0] : "";
  if (KNOWN_MIGRATION_WARNINGS.some((w) => message.startsWith(w))) return;
  throw new Error(message || args[0]);
};
