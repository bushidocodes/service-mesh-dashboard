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

// The Vite build and tsconfig `paths` alias `dygraphs` to its ES5 single-file
// build, which ships no type declarations. Declare a minimal surface for the
// Dygraph constructor the app uses (see GMLineChart/DygraphWrapper).
declare module "dygraphs" {
  const Dygraph: new (...args: unknown[]) => unknown;
  export default Dygraph;
}
