// Vite's dev-server proxy (vite.config.js) forwards /services and /metrics to
// port 9000, matching the fallback in src/utils/head.js.  Use PORT env var to
// override when needed (e.g. if 9000 is also taken on a given machine).
const PORT = parseInt(process.env.PORT, 10) || 9000;

module.exports = {
  PORT
};
