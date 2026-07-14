import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { SettingsState } from "types";

import { getFabricServer } from "utils/head";
import { getLocale } from "utils/i18n";

// Initial state is determined by whether a fabric server has been configured or
// not. If the server has been configured, then metricsEndpoint, threadsEndpoint,
// and runtime are set to null and will be later set by the response from the
// fabric server. If the server has not been configured, the values are assumed
// to be statically configured in the index.html head and populated immediately.
//
// RTK createSlice pilot (KD-4 / PR-16). Action types are namespaced by default
// (`settings/setUserLocale`, `settings/setThreadsFilter`) — no jumpstate flat
// type parity (KD-15).
const settingsSlice = createSlice({
  name: "settings",
  initialState: {
    fabricServer: getFabricServer(),
    threadsFilter: "all",
    locale: getLocale()
  } satisfies SettingsState,
  reducers: {
    setThreadsFilter(state, action: PayloadAction<string>) {
      state.threadsFilter = action.payload;
    },
    setUserLocale(state, action: PayloadAction<string>) {
      state.locale = action.payload;
    }
  }
});

export const { setThreadsFilter, setUserLocale } = settingsSlice.actions;
export default settingsSlice.reducer;
