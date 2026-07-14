import { State } from "store/jumpstate";

const threadsTable = State({
  initial: [],
  fetchThreadsSuccess(_state: any, payload: any) {
    const threads = payload.threads;
    const threadIds = threads ? Object.keys(threads) : [];
    if (threadIds.length === 0) return [];
    return threadIds.map((id) => ({
      name: threads[id].thread,
      id,
      priority: threads[id].priority,
      state: threads[id].state,
      daemon: threads[id].daemon,
      stack: threads[id].stack
    }));
  },
  clearThreads(_state: any, _payload: any) {
    return [];
  }
});

export default threadsTable;
