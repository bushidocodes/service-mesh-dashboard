import React, { act } from "react";
import { mount } from "enzyme";
import _ from "lodash";

import Uptime from "./UpTime";
import ArrayValue from "components/ArrayValue";

const renderFunc = (uptime) => (
  <ArrayValue>
    {_.map(uptime, (el) => (
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
jest.useFakeTimers();

describe("Uptime component", () => {
  let UptimeWrapper;
  beforeEach(() => {
    jest.setSystemTime(referenceNow - 1000);
    UptimeWrapper = mount(<Uptime startTime={startTime} render={renderFunc} />);
  });

  afterEach(() => {
    UptimeWrapper.unmount();
  });

  test("renders via the function passed as the render prop", () => {
    expect(UptimeWrapper.find(ArrayValue)).toHaveLength(1);
  });

  test("renders the correct value", () => {
    // Advance past the 1s interval so onChangeUptime() runs and sets state.
    // Wrap in act() so React 18 flushes the resulting setState synchronously
    // before we read the instance state.
    act(() => {
      jest.advanceTimersByTime(1000);
    });
    UptimeWrapper.update();
    expect(UptimeWrapper.state().uptime).toMatchObject([
      "1273d",
      "03h",
      "33m",
      "20s"
    ]);
    expect(UptimeWrapper.html().includes("1273d", "03h", "33m", "20s")).toBe(
      true
    );
  });
});
