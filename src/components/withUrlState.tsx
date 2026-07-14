import React from "react";
import { useSearchParams } from "react-router-dom";

/**
 * withUrlState is a HOC that syncs component state to the URL query string.
 *
 * This is a React Router v6 replacement for the deprecated `with-url-state`
 * package. Usage:
 *
 *   withUrlState()(Component)
 *
 * The wrapped component receives two extra props:
 *   urlState   – current query-string params parsed as a plain object
 *   setUrlState(patch) – shallowly merges `patch` into the current params
 *
 * @returns {function} HOC factory – call with Component to get the wrapped version
 */
export default function withUrlState() {
  return function (Component: React.ComponentType<any>) {
    function WithUrlState(props: any) {
      const [searchParams, setSearchParams] = useSearchParams();

      // Parse current query string into a plain object
      const urlState = Object.fromEntries(searchParams.entries());

      // Shallow-merge helper – preserves existing params not in the patch
      const setUrlState = (patch: Record<string, any>) =>
        setSearchParams((prev) => ({
          ...Object.fromEntries(prev.entries()),
          ...patch
        }));

      return (
        <Component {...props} urlState={urlState} setUrlState={setUrlState} />
      );
    }

    WithUrlState.displayName = `withUrlState(${
      Component.displayName || Component.name || "Component"
    })`;

    return WithUrlState;
  };
}
