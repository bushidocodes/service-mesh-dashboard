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
  "Warning: Legacy context API",
  "Warning: ReactDOM.render is no longer supported",
  "Warning: An update to",
  "Warning: Can't perform a React state update"
];

const originalConsoleError = console.error;
console.error = (...args) => {
  const message = typeof args[0] === "string" ? args[0] : "";
  if (KNOWN_MIGRATION_WARNINGS.some((w) => message.startsWith(w))) return;
  throw new Error(message || args[0]);
};
