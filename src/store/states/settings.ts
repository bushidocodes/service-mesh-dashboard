import { State } from "store/jumpstate";
import type { SettingsState } from "types";

import { getFabricServer } from "utils/head";
import { getLocale } from "utils/i18n";

// Initial state is determined by whether a fabric server has been configured or
// not. If the server has been configured, then metricsEndpoint, threadsEndpoint,
// and runtime are set to null and will be later set by the response from the
// fabric server. If the server has not been configured, the values are assumed
// to be statically configured in the index.html head and populated immediately.
const settings = State({
  initial: {
    fabricServer: getFabricServer(),
    threadsFilter: "all",
    locale: getLocale()
  } satisfies SettingsState,

  setThreadsFilter(state: SettingsState, payload: string) {
    return { ...state, threadsFilter: payload };
  },
  setUserLocale(state: SettingsState, payload: string) {
    return { ...state, locale: payload };
  }
});

export default settings;
