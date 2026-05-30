import { defineConfig, transformWithEsbuild } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const src = (p) => path.resolve(__dirname, "src", p);

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
      // the styled-components DevTools work in development.
      babel: {
        plugins: ["babel-plugin-styled-components"]
      }
    })
  ],

  // Tell esbuild (used by Vite 5's dep-optimizer) to parse every .js file as
  // JSX. The project predates the .jsx extension convention, so virtually
  // every source file contains JSX but is named .js.
  optimizeDeps: {
    // React 16 ships no jsx-runtime package — exclude it so the dep
    // optimizer doesn't emit "Failed to resolve dependency" warnings.
    exclude: ["react/jsx-runtime", "react/jsx-dev-runtime"],
    esbuildOptions: {
      loader: { ".js": "jsx" }
    }
  },

  // Replicate webpack's `resolve.modules: ["src", "node_modules"]` so
  // bare imports like `import x from "utils/head"` keep working.
  resolve: {
    alias: {
      AppHistory: src("AppHistory.js"),
      components: src("components"),
      images: src("images"),
      json: src("json"),
      services: src("services"),
      store: src("store"),
      style: src("style"),
      utils: src("utils"),
      // webpack had a specific dygraphs alias pointing at the ES5 build
      dygraphs: path.resolve(
        __dirname,
        "node_modules/dygraphs/src-es5/dygraph.js"
      ),
      // Some older deps reference react-native — shim to react-native-web
      "react-native": "react-native-web"
    }
  },

  // Polyfill process.env.NODE_ENV for legacy code that checks it directly.
  define: {
    "process.env.NODE_ENV": JSON.stringify(
      process.env.NODE_ENV || "development"
    )
  },

  server: {
    port: 3000,
    open: true,
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
  }
});
