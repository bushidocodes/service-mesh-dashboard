// Ambient declarations for non-code imports and untyped modules.
//
// Vite resolves asset imports to a URL string at build time; Jest's
// config/jest/fileTransform.cjs returns the basename string. Either way the
// imported value is a string, so declare these wildcard modules as such.

declare module "*.svg" {
  const src: string;
  export default src;
}

declare module "*.png" {
  const src: string;
  export default src;
}

declare module "*.jpg" {
  const src: string;
  export default src;
}

declare module "*.gif" {
  const src: string;
  export default src;
}

declare module "*.ttf" {
  const src: string;
  export default src;
}

declare module "*.otf" {
  const src: string;
  export default src;
}

declare module "*.woff" {
  const src: string;
  export default src;
}

declare module "*.woff2" {
  const src: string;
  export default src;
}

declare module "*.txt" {
  const src: string;
  export default src;
}

// CSS imported for its side effects (e.g. third-party stylesheets like
// react-toastify). The imported value isn't used; declare it so side-effect
// imports type-check.
declare module "*.css";

// The app stores its polling interval IDs as ad-hoc properties on `window`
// (see the services layer and utils). Declare them so those reads/writes
// type-check.
interface Window {
  refreshFabricIntervalID?: ReturnType<typeof setInterval> | null;
  refreshInstanceMetricsPollingInterval?: ReturnType<typeof setInterval> | null;
}

// `process.env.NODE_ENV` is read in a few modules and replaced at build time by
// Vite/Jest. Declare a minimal ambient `process` so those reads type-check
// without pulling in the full @types/node surface.
declare const process: {
  env: Record<string, string | undefined>;
};

// Legacy, vendor-prefixed navigator language properties read by utils/i18n.
interface Navigator {
  userLanguage?: string;
  browserLanguage?: string;
  systemLanguage?: string;
}

// The Vite build and tsconfig `paths` alias `dygraphs` to its ES5 single-file
// build, which ships no type declarations. Declare a minimal surface for the
// Dygraph constructor the app uses (see GMLineChart/DygraphWrapper).
declare module "dygraphs" {
  const Dygraph: new (...args: unknown[]) => unknown;
  export default Dygraph;
}

// `object-sizeof` and `js-quantities` ship no type declarations and have no
// @types packages. Declare minimal ambient surfaces for the single default
// export each module provides so importers type-check without per-import
// suppressions.
declare module "object-sizeof" {
  const sizeof: (object: unknown) => number;
  export default sizeof;
}

declare module "js-quantities" {
  const Qty: any;
  export default Qty;
}
