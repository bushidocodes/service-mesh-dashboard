/**
 * Compatibility shim for enzyme@3 + cheerio@1.0.0.
 *
 * enzyme@3 calls require('cheerio').default.load(), but cheerio@1.0.0
 * dropped its default export (it now only has named exports: load, contains,
 * etc.). This shim re-exports everything from the real cheerio and adds a
 * `default` property pointing to the same namespace so enzyme's import
 * interop keeps working.
 *
 * Additionally, cheerio@1.0.0 pulls in undici (for HTTP-fetch support via
 * cheerio.fromURL). undici in turn needs ReadableStream / WritableStream
 * globals that are absent in jest-environment-jsdom 20.x. Since tests never
 * call cheerio.fromURL, we redirect undici to an empty stub via the
 * moduleNameMapper ("^undici$" → emptyMock.js) so that cheerio can load
 * without error.
 */
const cheerio = jest.requireActual("cheerio");
module.exports = { ...cheerio, default: cheerio };
