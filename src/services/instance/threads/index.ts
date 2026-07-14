import type { AppThunk } from "store/appThunk";
import { setThreadsError } from "store/states/instance";
import {
  fetchThreadsSuccess,
  type ThreadsApiPayload
} from "store/states/threadsTable";
import { reportError } from "../../notification";
import { fetchInstanceThreads } from "./apis";

/**
 * Fetch threads information (JVM) and store in Redux.
 * RTK thunk (PR-18a) — replaces the jumpstate Effect of the same name.
 */
export function fetchAndStoreInstanceThreads(
  endpoint: string
): AppThunk<Promise<void>> {
  return async (dispatch) => {
    if (!endpoint) return;
    try {
      const json = await fetchInstanceThreads(endpoint);
      dispatch(fetchThreadsSuccess(json as ThreadsApiPayload));
    } catch (err) {
      dispatch(fetchThreadsFailure(err));
    }
  };
}

/**
 * Handle thread fetch errors: notify the user and set instance.threadsError.
 */
export function fetchThreadsFailure(err: unknown): AppThunk {
  return (dispatch) => {
    reportError("Fetching Threads Data failed.", false, err);
    // The instance slice stores whatever is passed (strings from Promise.reject,
    // Error from fetch, etc.). Cast to satisfy InstanceState.threadsError typing.
    dispatch(setThreadsError(err as Record<string, unknown>));
  };
}
