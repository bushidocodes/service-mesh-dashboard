import type { ComponentType } from "react";
import { useSearchParams } from "react-router-dom";

/**
 * Syncs component state to the URL query string (React Router v6).
 *
 * Returns:
 *   urlState   – current query-string params parsed as a plain object
 *   setUrlState(patch) – shallowly merges `patch` into the current params
 *
 * Prefer this hook in new function components. The `withUrlState` HOC below
 * remains for class components that have not yet been converted.
 */
export function useUrlState(): {
  urlState: Record<string, string>;
  setUrlState: (patch: Record<string, string | boolean | number>) => void;
} {
  const [searchParams, setSearchParams] = useSearchParams();

  const urlState = Object.fromEntries(searchParams.entries());

  const setUrlState = (patch: Record<string, string | boolean | number>) =>
    setSearchParams((prev) => {
      const next: Record<string, string> = {
        ...Object.fromEntries(prev.entries())
      };
      for (const [key, value] of Object.entries(patch)) {
        next[key] = String(value);
      }
      return next;
    });

  return { urlState, setUrlState };
}

/**
 * HOC factory wrapping {@link useUrlState} for class components still on
 * the legacy stack. Prefer `useUrlState` in function components.
 *
 *   withUrlState()(Component)
 *
 * Intentionally loosely typed so existing class HOC stacks (connect +
 * withUrlState + injectIntl) keep compiling until each site is converted.
 */
export default function withUrlState() {
  return function (Component: ComponentType<any>) {
    function WithUrlState(props: any) {
      const { urlState, setUrlState } = useUrlState();

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
