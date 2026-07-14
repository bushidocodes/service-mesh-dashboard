import type { ComponentType } from "react";
import {
  type Location,
  type NavigateOptions,
  type To,
  useLocation,
  useNavigate,
  useParams
} from "react-router-dom";

/**
 * withRouter compatibility shim for React Router v6.
 *
 * React Router v6 removed the withRouter HOC in favour of hooks. This shim
 * recreates the v4 API (history, location, match props) so that existing class
 * components can keep working unchanged while the codebase migrates
 * incrementally to hooks.
 *
 * history shape exposed by this shim:
 *   push(path)          – navigate forward
 *   replace(path|loc)   – navigate without adding a history entry
 *   go(n)               – move n steps in the history stack
 *   goBack()            – go(-1)
 *   goForward()         – go(1)
 *   location            – current location object
 *
 * match shape (simplified – no regex support):
 *   params  – URL params from useParams()
 *   isExact – always true (v6 routes are always exact)
 *   path    – current pathname
 *   url     – current pathname
 */

type LocationDescriptor = {
  pathname?: string;
  search?: string;
  hash?: string;
  state?: unknown;
};

export type WithRouterHistory = {
  push: (path: To, options?: NavigateOptions) => void;
  replace: (pathOrLocation: string | LocationDescriptor) => void;
  go: (n: number) => void;
  goBack: () => void;
  goForward: () => void;
  location: Location;
};

export type WithRouterMatch = {
  params: Readonly<Record<string, string | undefined>>;
  isExact: boolean;
  path: string;
  url: string;
};

export type WithRouterProps = {
  history: WithRouterHistory;
  location: Location;
  match: WithRouterMatch;
};

/**
 * Wraps a component and injects history/location/match.
 *
 * Return type intersects `Record<string, unknown>` so HOC composition that
 * erases intermediate props (e.g. `withUrlState as any`) still accepts
 * caller-supplied props like `services` at JSX sites — same ergonomics as
 * the previous untyped shim, without reintroducing an explicit `any`.
 */
export function withRouter<P extends object>(
  Component: ComponentType<P>
): ComponentType<Omit<P, keyof WithRouterProps> & Record<string, unknown>> {
  function Wrapped(
    props: Omit<P, keyof WithRouterProps> & Record<string, unknown>
  ) {
    const location = useLocation();
    const navigate = useNavigate();
    const params = useParams();

    const match: WithRouterMatch = {
      params,
      isExact: true,
      path: location.pathname,
      url: location.pathname
    };

    // Replicate the history v4 API used in class components.
    // replace() accepts either a string path or a location descriptor object
    // { pathname?, search?, hash?, state? } – the same shapes the app uses.
    const history: WithRouterHistory = {
      push: (path: To, options?: NavigateOptions) => navigate(path, options),
      replace: (pathOrLocation: string | LocationDescriptor) => {
        if (typeof pathOrLocation === "string") {
          navigate(pathOrLocation, { replace: true });
        } else {
          const { pathname, search, hash, state } = pathOrLocation || {};
          navigate(pathname ? { pathname, search, hash } : ".", {
            replace: true,
            state
          });
        }
      },
      go: (n: number) => navigate(n),
      goBack: () => navigate(-1),
      goForward: () => navigate(1),
      location
    };

    return (
      <Component
        {...(props as P)}
        history={history}
        location={location}
        match={match}
      />
    );
  }

  Wrapped.displayName = `withRouter(${
    Component.displayName || Component.name || "Component"
  })`;

  return Wrapped;
}

export default withRouter;
