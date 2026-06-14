import { TextEncoder, TextDecoder } from "util";

// TextEncoder/TextDecoder are not in the jsdom global by default, but some
// dependencies require them at module load time.
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
  // require() is intentional here: conditional polyfills can't use static
  // imports; babel-jest transforms these to CJS require() at test time.
  require("promise/lib/rejection-tracking").enable();
  window.Promise = require("promise/lib/es6-extensions.js");
}

// fetch() polyfill for making API calls.
if (typeof window.fetch !== "function") {
  require("whatwg-fetch");
}
