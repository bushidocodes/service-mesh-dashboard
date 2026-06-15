import { State } from "store/jumpstate";

const threadsTable = State({
  initial: [],
  fetchThreadsSuccess(state, payload) {
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
  clearThreads(state, payload) {
    return [];
  }
});

export default threadsTable;
