/**
 * Empty module mock used by Jest's moduleNameMapper.
 *
 * Some packages (e.g. undici, which cheerio@1.x pulls in for HTTP-fetch
 * support) require browser globals (ReadableStream, WritableStream, etc.)
 * that are not available in jest-environment-jsdom 20.x. In tests these
 * packages are never exercised (enzyme uses cheerio for static HTML
 * parsing only), so we safely replace them with an empty stub.
 */
module.exports = {};
