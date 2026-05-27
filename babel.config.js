/**
 * Babel 7 configuration used exclusively by Jest (babel-jest@29).
 *
 * The webpack build still uses babel-core@6 + config/babelPlugins.js via
 * babel-loader, which reads the Babel 6 config passed directly to the loader
 * rather than from this file.  Scoping this to env.test ensures Babel 7 is
 * only activated by the test runner and never interferes with the build.
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
