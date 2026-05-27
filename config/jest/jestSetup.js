// Based on https://hackernoon.com/testing-react-components-with-jest-and-enzyme-41d592c174f
// import "babel-polyfill";
import Enzyme, { shallow, render, mount } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
// React 16 Enzyme adapter
Enzyme.configure({ adapter: new Adapter() });
// Make Enzyme functions available in all test files without importing
// Fail tests on any warning
console.error = (message, ...args) => {
  // React Router v6 uses useLayoutEffect internally, which fires a benign SSR
  // warning when enzyme's render() calls renderToStaticMarkup. Suppress it.
  if (typeof message === "string" && message.includes("useLayoutEffect"))
    return;
  // React 16 warns when a state update (e.g. setSearchParams inside withUrlState)
  // is triggered outside of act(). Enzyme does not automatically wrap prop calls
  // in act(), so this fires in every test that calls setUrlState directly. The
  // assertions still work correctly; this is purely a testing-methodology warning.
  // Migrate to react-testing-library (PR #16+) to resolve this properly.
  if (typeof message === "string" && message.includes("not wrapped in act"))
    return;
  throw new Error(message);
};
