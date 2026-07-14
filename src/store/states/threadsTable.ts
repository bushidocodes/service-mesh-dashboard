import { State } from "store/jumpstate";
import type { ThreadsTableItem } from "types";

/** Shape of the JVM threads API response stored via `fetchThreadsSuccess`. */
interface ThreadsApiPayload {
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

const threadsTable = State({
  initial: [] as ThreadsTableItem[],
  fetchThreadsSuccess(
    _state: ThreadsTableItem[],
    payload: ThreadsApiPayload
  ): ThreadsTableItem[] {
    const threads = payload.threads;
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
  clearThreads(
    _state: ThreadsTableItem[],
    _payload?: unknown
  ): ThreadsTableItem[] {
    return [];
  }
});

export default threadsTable;
