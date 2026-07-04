/// <reference types="vitest/config" />
import { defineConfig, transformWithEsbuild } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { fileURLToPath } from "url";

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
    // MUST be listed first: transform JSX in every src .js file to plain JS
    // before `vite:import-analysis` tries to parse it with acorn.  The project
    // predates the .jsx extension convention so virtually every source file
    // contains JSX but is named .js.  Without this pre-pass the import
    // analyzer chokes on JSX syntax.
    {
      name: "treat-js-as-jsx",
      enforce: "pre",
      async transform(code, id) {
        if (id.includes("node_modules")) return null;
        if (!id.endsWith(".js")) return null;
        return transformWithEsbuild(code, id, {
          loader: "jsx",
          // Classic transform → React.createElement; matches React 16.
          jsx: "transform",
          jsxFactory: "React.createElement",
          jsxFragment: "React.Fragment"
        });
      }
    },
    react({
      // React 16 ships classic JSX transform only — no jsx-runtime package.
      jsxRuntime: "classic",
      // Run babel-plugin-styled-components so display names and
      // the styled-components DevTools work in development. In tests, disable
      // CSS minification so the jest-styled-components serializer emits the same
      // spacing the old Jest pipeline did (which had no styled-components babel
      // plugin) — keeps snapshots byte-stable across the migration.
      babel: {
        plugins: [
          [
            "babel-plugin-styled-components",
            isTest
              ? // In tests: don't minify CSS (so the jest-styled-components
                // serializer emits the same spacing the old Jest pipeline did,
                // which had no styled-components babel plugin), and disable
                // displayName so the generated componentId keeps its `sc-`
                // prefix. jest-styled-components' toHaveStyleRule only treats a
                // class as styled if it matches /(_|-)+sc-.+|^sc-/; the
                // displayName form (`Copyright-bhDgoP`) drops `sc-` and breaks
                // the matcher, while snapshots normalise the class to `c0`
                // either way.
                { minify: false, displayName: false }
              : {}
          ]
        ]
      }
    }),
    // Test-only: stub CSS/asset imports to match the legacy Jest transforms.
    ...(isTest ? [testTransformStub] : [])
  ],

  // Tell esbuild (used by Vite 5's dep-optimizer) to parse every .js file as
  // JSX. The project predates the .jsx extension convention, so virtually
  // every source file contains JSX but is named .js.
  optimizeDeps: {
    // NOTE: do NOT exclude react/jsx-runtime here. The app itself uses the
    // classic transform (jsxRuntime: "classic" below), but third-party deps
    // (react-router-dom v7, etc.) are shipped compiled with the *automatic*
    // runtime and import { jsx, jsxs } from "react/jsx-runtime". React 19
    // provides that module, so it must be pre-bundled like any other dep.
    // Excluding it made Vite 8's Rolldown optimizer serve it as a CJS→ESM
    // wrapper with only a default export, so lazily-loaded dashboard chunks
    // threw `does not provide an export named 'jsx'` and rendered empty grids.
    esbuildOptions: {
      loader: { ".js": "jsx" }
    }
  },

  // Replicate webpack's `resolve.modules: ["src", "node_modules"]` so
  // bare imports like `import x from "utils/head"` keep working.
  resolve: {
    // Force a single instance of these so test helpers that reach into
    // styled-components/React internals (jest-styled-components reads
    // styled-components' __PRIVATE__ stylesheet) see the same module the
    // components under test use — otherwise toHaveStyleRule finds an empty sheet.
    dedupe: ["styled-components", "react", "react-dom"],
    alias: {
      AppHistory: src("AppHistory.js"),
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
    open: false,
    // Proxy API requests to the mock discovery service so the browser
    // never makes cross-origin calls (avoids the CORS issue with absolute URLs).
    proxy: {
      "/services": "http://localhost:9000",
      "/metrics": "http://localhost:9000"
    }
  },

  build: {
    outDir: "build",
    sourcemap: true
  },

  // Vitest configuration. Reuses every plugin/alias above (the JSX-in-.js
  // pre-pass, styled-components babel plugin, and the `src` path aliases) so
  // tests run through the exact same transform pipeline as the build — which is
  // the whole point of moving off Jest + Babel (issue #197).
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
    // components use, so toHaveStyleRule reads the populated stylesheet.
    server: {
      deps: {
        inline: ["jest-styled-components"]
      }
    }
  }
});
