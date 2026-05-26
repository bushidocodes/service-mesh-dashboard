/**
 * Babel configuration for Jest (test environment only).
 *
 * Vite handles transpilation for development and production builds via
 * @vitejs/plugin-react (esbuild + its own Babel pipeline). This file is
 * intentionally scoped to the "test" environment so it only applies when
 * Jest sets BABEL_ENV=test.
 *
 * Key choices:
 *  - @babel/preset-env with targets.node="current" so Jest can import ESM
 *    source files (dynamic import, optional chaining, etc.) without a
 *    separate loader. Targeting the running Node version means Babel skips
 *    transforms that the engine already supports natively.
 *  - @babel/preset-react with runtime="classic" matches the project's
 *    existing JSX transform (React.createElement) used by Vite / esbuild.
 */
module.exports = {
  env: {
    test: {
      presets: [
        ["@babel/preset-env", { targets: { node: "current" } }],
        ["@babel/preset-react", { runtime: "classic" }]
      ]
    }
  }
};
