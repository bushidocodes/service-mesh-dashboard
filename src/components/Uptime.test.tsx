import React, { act } from "react";
import { render } from "@testing-library/react";

import Uptime from "./UpTime";
import ArrayValue from "components/ArrayValue";

const renderFunc = (uptime: any) => (
  <ArrayValue>
    {uptime.map((el: string) => (
      <span key={el}>{el} </span>
    ))}
  </ArrayValue>
);

const startTime = 1401164339200;

// The "now" we want Date.now() to report when uptime is sampled. The component
// reports uptime as (now - startTime), which is exactly 1273d 03h 33m 20s here.
// onChangeUptime() samples Date.now() 1s after mount, so we start the fake clock
// 1000ms earlier and then advance by 1000ms to land precisely on referenceNow.
const referenceNow = 1511164339200;

// Jest 29's modern fake timers also control the system clock, so we drive
// Date.now() via setSystemTime() rather than monkey-patching it — a manual
// `Date.now = () => ...` is overridden once useFakeTimers() installs its own
// Date implementation.
vi.useFakeTimers();

describe("Uptime component", () => {
  let container: HTMLElement;
  let unmount: () => void;
  beforeEach(() => {
    vi.setSystemTime(referenceNow - 1000);
    ({ container, unmount } = render(
      <Uptime startTime={startTime} render={renderFunc} />
    ));
  });

  afterEach(() => {
    unmount();
  });

  test("renders via the function passed as the render prop", () => {
    // The render prop produces a single ArrayValue (a styled.div). Counting the
    // rendered divs is the observable proxy for `.find(ArrayValue).toHaveLength(1)`.
    expect(container.querySelectorAll("div")).toHaveLength(1);
  });

  test("renders the correct value", () => {
    // Advance past the 1s interval so the useEffect timer fires and updates state.
    // Wrap in act() so React 18 flushes the resulting setState synchronously
    // before we read the rendered output.
    act(() => {
      vi.advanceTimersByTime(1000);
    });
    const html = container.innerHTML;
    expect(html).toContain("1273d");
    expect(html).toContain("03h");
    expect(html).toContain("33m");
    expect(html).toContain("20s");
  });
});
