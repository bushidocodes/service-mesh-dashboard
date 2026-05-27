// Based on https://hackernoon.com/testing-react-components-with-jest-and-enzyme-41d592c174f
// import "babel-polyfill";
import Enzyme, { shallow, render, mount } from "enzyme";
import Adapter from "@cfaester/enzyme-adapter-react-18";
// React 18 Enzyme adapter
Enzyme.configure({ adapter: new Adapter() });

// Stub HTMLCanvasElement.getContext for JSDOM.
// Libraries like Dygraphs call canvas.getContext('2d') during mount; JSDOM does
// not implement it and throws a "not implemented" error that would fail tests.
// Providing a no-op 2D context prevents the crash without affecting assertions
// that only inspect props/DOM structure (never the actual pixel output).
if (typeof HTMLCanvasElement !== "undefined") {
  HTMLCanvasElement.prototype.getContext = jest.fn(() => ({
    fillStyle: "",
    strokeStyle: "",
    lineWidth: 1,
    font: "",
    textAlign: "start",
    textBaseline: "alphabetic",
    globalAlpha: 1,
    canvas: { width: 0, height: 0 },
    fillRect: jest.fn(),
    clearRect: jest.fn(),
    strokeRect: jest.fn(),
    beginPath: jest.fn(),
    moveTo: jest.fn(),
    lineTo: jest.fn(),
    closePath: jest.fn(),
    stroke: jest.fn(),
    fill: jest.fn(),
    arc: jest.fn(),
    arcTo: jest.fn(),
    bezierCurveTo: jest.fn(),
    quadraticCurveTo: jest.fn(),
    rect: jest.fn(),
    ellipse: jest.fn(),
    clip: jest.fn(),
    rotate: jest.fn(),
    scale: jest.fn(),
    translate: jest.fn(),
    transform: jest.fn(),
    setTransform: jest.fn(),
    resetTransform: jest.fn(),
    save: jest.fn(),
    restore: jest.fn(),
    createLinearGradient: jest.fn(() => ({ addColorStop: jest.fn() })),
    createRadialGradient: jest.fn(() => ({ addColorStop: jest.fn() })),
    createPattern: jest.fn(() => null),
    drawImage: jest.fn(),
    fillText: jest.fn(),
    strokeText: jest.fn(),
    measureText: jest.fn(() => ({
      width: 0,
      actualBoundingBoxAscent: 0,
      actualBoundingBoxDescent: 0,
      actualBoundingBoxLeft: 0,
      actualBoundingBoxRight: 0
    })),
    getImageData: jest.fn(() => ({
      data: new Uint8ClampedArray(0),
      width: 0,
      height: 0
    })),
    putImageData: jest.fn(),
    createImageData: jest.fn(() => ({ data: new Uint8ClampedArray(0) })),
    setLineDash: jest.fn(),
    getLineDash: jest.fn(() => []),
    isPointInPath: jest.fn(() => false),
    isPointInStroke: jest.fn(() => false)
  }));
}
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
