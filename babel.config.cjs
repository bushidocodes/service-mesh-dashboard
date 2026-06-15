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
        ["@babel/preset-react", { runtime: "classic" }],
        // Strip TypeScript types so babel-jest can transpile .ts/.tsx test
        // imports. `allExtensions` + `isTSX` lets the preset parse JSX in every
        // file regardless of extension (the project's .js files contain JSX too).
        ["@babel/preset-typescript", { allExtensions: true, isTSX: true }]
      ]
    }
  }
};
