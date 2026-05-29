"use strict";

// TextEncoder/TextDecoder are not in the jsdom global by default, but some
// dependencies require them at module load time.
const { TextEncoder, TextDecoder } = require("util");
if (typeof global.TextDecoder === "undefined") {
  global.TextDecoder = TextDecoder;
}
if (typeof global.TextEncoder === "undefined") {
  global.TextEncoder = TextEncoder;
}

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
