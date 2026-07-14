import { useSearchParams } from "react-router-dom";

/**
 * Syncs component state to the URL query string (React Router v6).
 *
 * Returns:
 *   urlState   – current query-string params parsed as a plain object
 *   setUrlState(patch) – shallowly merges `patch` into the current params
 *
 * Prefer this hook in function components. The former `withUrlState` HOC was
 * removed once all call sites used this hook.
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
