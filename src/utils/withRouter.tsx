import React from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";

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
export function withRouter(Component) {
  function Wrapped(props) {
    const location = useLocation();
    const navigate = useNavigate();
    const params = useParams();

    const match = {
      params,
      isExact: true,
      path: location.pathname,
      url: location.pathname
    };

    // Replicate the history v4 API used in class components.
    // replace() accepts either a string path or a location descriptor object
    // { pathname?, search?, hash?, state? } – the same shapes the app uses.
    const history = {
      push: (path) => navigate(path),
      replace: (pathOrLocation) => {
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
      go: (n) => navigate(n),
      goBack: () => navigate(-1),
      goForward: () => navigate(1),
      location
    };

    return (
      <Component
        {...props}
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
