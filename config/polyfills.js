"use strict";

if (typeof Promise === "undefined") {
  // Rejection tracking prevents a common issue where React gets into an
  // inconsistent state due to an error, but it gets swallowed by a Promise,
  // and the user has no idea what causes React's erratic future behavior.
  require("promise/lib/rejection-tracking").enable();
  window.Promise = require("promise/lib/es6-extensions.js");
}

// fetch() polyfill for making API calls.
if (typeof window.fetch !== "function") {
  require("whatwg-fetch");
}

// jest-environment-jsdom (jsdom 20) doesn't expose Node.js built-in globals
// TextEncoder / TextDecoder in the window/global scope. The
// @cfaester/enzyme-adapter-react-18 render() helper requires TextEncoder to be
// a global when running under jsdom.
if (typeof global.TextEncoder === "undefined") {
  const { TextDecoder: TD, TextEncoder: TE } = require("util");
  global.TextEncoder = TE;
  global.TextDecoder = TD;
}
