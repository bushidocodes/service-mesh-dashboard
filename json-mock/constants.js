// Vite's dev-server proxy (vite.config.js) forwards /services and /metrics to
// port 9000, matching the fallback in src/utils/head.js. Use SDS_PORT env var
// to override when needed (e.g. if 9000 is also taken on a given machine).
// This is a dedicated variable rather than PORT: `pnpm start` runs this
// service alongside Vite, which also reads PORT for its own dev-server port,
// so sharing the name would make a single PORT value collide between the two.
export const PORT = parseInt(process.env.SDS_PORT, 10) || 9000;
