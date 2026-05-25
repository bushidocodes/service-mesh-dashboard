import Loadable from "react-loadable";
import { Loading } from "components/Loading";

const LazyLoader = (opts) => {
  // react-loadable v5 only unwraps `module.default` when the module has
  // `__esModule: true` (a webpack/Babel convention).  Vite serves real ESM so
  // dynamic import() returns a namespace object WITHOUT that flag.  Wrap the
  // loader here — once — so every LazyLoader call site gets the right default
  // export regardless of bundler.
  const wrappedLoader = opts.loader
    ? () => opts.loader().then((m) => m.default || m)
    : undefined;

  return Loadable(
    Object.assign(
      {
        loading: Loading,
        delay: 250,
        timeout: 15000
      },
      opts,
      wrappedLoader ? { loader: wrappedLoader } : null
    )
  );
};

export { LazyLoader };
