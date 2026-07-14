/// <reference types="vitest/config" />

import babel from "@rolldown/plugin-babel";
import react from "@vitejs/plugin-react";
import path from "path";
import { fileURLToPath } from "url";
import { defineConfig } from "vite";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const src = (p) => path.resolve(__dirname, "src", p);

// Vitest sets process.env.VITEST before loading this config; gate all test-only
// behaviour on it alone. (Deliberately NOT NODE_ENV==="test": the e2e suite runs
// against the real dev server and must NOT get the asset/CSS stubs or the
// no-displayName styled-components, even if invoked with NODE_ENV=test.)
const isTest = process.env.VITEST === "true";

// Mirror the old Jest transforms (config/jest/{cssTransform,fileTransform}.cjs)
// under Vitest so snapshots stay byte-stable: style imports become empty objects
// and static asset imports resolve to just their basename (e.g. "logo.svg")
// rather than the Vite-resolved URL. Only active during tests.
const testTransformStub = {
  name: "test-css-and-asset-stub",
  enforce: "pre",
  load(id) {
    const file = id.split("?")[0];
    if (/\.css$/.test(file)) return "export default {};";
    if (/\.(svg|png|jpe?g|gif|webp|ico|bmp|avif)$/.test(file)) {
      return `export default ${JSON.stringify(path.basename(file))};`;
    }
    return null;
  }
};

export default defineConfig({
  // Pin the project root to this config file's directory so that Vite never
  // follows a node_modules junction/symlink via realpathSync and ends up
  // treating the parent repo as the root. Required for git worktree support.
  root: __dirname,
  plugins: [
    // @vitejs/plugin-react v6: Oxc handles JSX + Fast Refresh (no Babel).
    react({
      jsxRuntime: "automatic"
    }),
    // styled-components display names / componentIds. plugin-react v6 dropped
    // its built-in Babel option; run the SC plugin via @rolldown/plugin-babel.
    babel({
      plugins: [
        [
          "babel-plugin-styled-components",
          isTest
            ? // In tests: don't minify CSS (so the jest-styled-components
              // snapshot serializer emits the same spacing the old Jest
              // pipeline did), and disable displayName so the generated
              // componentId keeps its `sc-` prefix (displayName form
              // `Copyright-bhDgoP` drops `sc-`). Snapshots normalise the
              // class to `c0` either way.
              { minify: false, displayName: false }
            : {}
        ]
      ]
    }),
    // Test-only: stub CSS/asset imports to match the legacy Jest transforms.
    ...(isTest ? [testTransformStub] : [])
  ],

  // NOTE: do NOT exclude react/jsx-runtime from dep optimization. The app and
  // third-party deps import { jsx, jsxs } from "react/jsx-runtime". Excluding
  // it made Vite 8's Rolldown optimizer serve a CJS→ESM wrapper with only a
  // default export, so lazily-loaded dashboard chunks threw
  // `does not provide an export named 'jsx'` and rendered empty grids.

  // Replicate webpack's `resolve.modules: ["src", "node_modules"]` so
  // bare imports like `import x from "utils/head"` keep working.
  resolve: {
    // Force a single instance of these so test helpers that reach into
    // styled-components/React internals (jest-styled-components snapshot
    // serializer reads styled-components' __PRIVATE__ stylesheet) see the
    // same module the components under test use.
    dedupe: ["styled-components", "react", "react-dom"],
    alias: {
      components: src("components"),
      images: src("images"),
      json: src("json"),
      messages: src("messages.ts"),
      services: src("services"),
      store: src("store"),
      style: src("style"),
      types: src("types.ts"),
      utils: src("utils"),
      // webpack had a specific dygraphs alias pointing at the ES5 build
      dygraphs: path.resolve(
        __dirname,
        "node_modules/dygraphs/src-es5/dygraph.js"
      )
    }
  },

  // Polyfill process.env.NODE_ENV for legacy code that checks it directly.
  define: {
    "process.env.NODE_ENV": JSON.stringify(
      process.env.NODE_ENV || "development"
    )
  },

  server: {
    port: parseInt(process.env.PORT, 10) || 3000,
    open: false
    // No dev proxy: getFabricServer() (src/utils/head.ts) resolves an absolute
    // http://localhost:9000 URL in development, so API calls are cross-origin
    // by design and rely on the mock discovery service's cors() middleware
    // (json-mock/discovery-service/sds.js), not a same-origin proxy.
  },

  build: {
    outDir: "build",
    sourcemap: true
  },

  // Vitest configuration. Reuses every plugin/alias above (the styled-components
  // babel plugin and the `src` path aliases) so tests run through the same
  // transform pipeline as the build.
  test: {
    // Jest-style implicit globals (describe/it/expect/beforeEach/vi-as-jest)
    // so the ~238 existing suites need no per-file imports.
    globals: true,
    environment: "jsdom",
    // setupFiles run after the framework is ready (globals available), matching
    // the old setupFiles + setupFilesAfterEnv ordering closely enough.
    setupFiles: [
      "./config/polyfills.js",
      "./config/jest/jestSetup.js",
      "./config/jest/jestTestFrameworkSetup.js"
    ],
    include: [
      "src/**/__tests__/**/*.{js,jsx,ts,tsx}",
      "src/**/*.{spec,test}.{js,jsx,ts,tsx}"
    ],
    exclude: [
      "**/node_modules/**",
      "**/.claude/worktrees/**",
      "src/Storyshots.test.js"
    ],
    // Replicate the Jest moduleNameMapper that swapped @testing-library/react
    // for the StyleSheetManager-wrapping render (config/jest/rtlWrapper.cjs).
    // Exact-match regex so the wrapper's own /dist/ subpath require is untouched.
    alias: [
      {
        find: /^@testing-library\/react$/,
        replacement: path.resolve(__dirname, "config/jest/rtlWrapper.js")
      }
    ],
    environmentOptions: { jsdom: { url: "http://localhost" } },
    // jest-styled-components internally `require("styled-components")`. Vitest
    // externalizes node_modules by default, which would hand it a second
    // styled-components instance (CJS build) with its own empty sheet. Inlining
    // it routes that require through Vite's resolver to the same instance the
    // components use so the snapshot CSS serializer sees populated rules.
    server: {
      deps: {
        inline: ["jest-styled-components"]
      }
    }
  }
});
