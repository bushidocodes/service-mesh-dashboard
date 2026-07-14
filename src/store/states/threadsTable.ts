import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { ThreadsTableItem } from "types";

/** Shape of the JVM threads API response stored via `fetchThreadsSuccess`. */
export interface ThreadsApiPayload {
  threads?: Record<
    string,
    {
      thread?: string;
      priority?: number;
      state?: string;
      daemon?: boolean;
      stack?: string[];
    }
  >;
}

// RTK threadsTable slice (PR-18a). Action types are namespaced by default
// (`threadsTable/fetchThreadsSuccess`, ΓÇª) ΓÇö no jumpstate flat type parity (KD-15).
const threadsTableSlice = createSlice({
  name: "threadsTable",
  initialState: [] as ThreadsTableItem[],
  reducers: {
    fetchThreadsSuccess(
      _state,
      action: PayloadAction<ThreadsApiPayload>
    ): ThreadsTableItem[] {
      const threads = action.payload.threads;
      if (!threads) return [];
      const threadIds = Object.keys(threads);
      if (threadIds.length === 0) return [];
      return threadIds.flatMap((id) => {
        const thread = threads[id];
        if (!thread) return [];
        return [
          {
            name: thread.thread,
            // Object.keys yields strings; coerce so store matches ThreadsTableItem.id
            // (number) and the UI's Number(id) usage.
            id: Number(id),
            priority: thread.priority,
            state: thread.state,
            daemon: thread.daemon,
            stack: thread.stack
          }
        ];
      });
    },
    clearThreads(): ThreadsTableItem[] {
      return [];
    }
  }
});

export const { fetchThreadsSuccess, clearThreads } = threadsTableSlice.actions;
export default threadsTableSlice.reducer;
