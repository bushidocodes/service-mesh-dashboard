import state from "../../json/mockReduxState";

import { getThreadCounts, getVisibleThreads } from "./selectors";

describe("Reselect selector getVisibleThreads", () =>
  test("returns an array of thread objects matching state.settings.threadsFilter ", () => {
    expect(getVisibleThreads(state)).toEqual([
      {
        daemon: true,
        id: "2",
        name: "Test Runnable",
        priority: 8,
        stack: [
          "java.lang.Object.wait(Native Method)",
          "java.lang.ref.ReferenceQueue.remove(ReferenceQueue.java:143)",
          "java.lang.ref.ReferenceQueue.remove(ReferenceQueue.java:164)",
          "java.lang.ref.Finalizer$FinalizerThread.run(Finalizer.java:209)"
        ],
        state: "RUNNABLE"
      }
    ]);
  }));

describe("Reselect selector getThreadCounts", () =>
  test("returns an array of totals for each thread type ", () => {
    expect(getThreadCounts(state)).toEqual({
      active: 1,
      all: 6,
      idle: 2,
      stopped: 3
    });
  }));
