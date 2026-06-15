import { lazy, type ComponentType } from "react";

/**
 * Thin wrapper around React.lazy() that preserves the call signature used
 * by call sites in this codebase (`LazyLoader({ loader: () => import(...) })`),
 * while delegating to the native React lazy loading APIs introduced in
 * React 16.6 / 18.
 *
 * Vite serves real ESM, so a dynamic import() returns a Module namespace
 * object whose `.default` property holds the default export. Most lazy
 * targets here are React component modules that use `export default`, so
 * `m.default` is the right thing to pass to React.lazy. The `?? m` fallback
 * keeps the previous behaviour of accepting a module that itself acts as
 * the component (e.g. an old CJS module that sets module.exports directly).
 *
 * Must be paired with a <Suspense fallback={<Loading />}> boundary
 * somewhere up the tree. Wrap that boundary in an <ErrorBoundary> to
 * surface load failures gracefully.
 */
export const LazyLoader = (opts: { loader: () => Promise<any> }) =>
  // Type the lazy component as ComponentType<any> so call sites can still pass
  // props (the lazy targets are real components with their own prop types).
  lazy<ComponentType<any>>(() =>
    opts.loader().then((m: any) => ({ default: m.default ?? m }))
  );
