import React from "react";
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

// Mock the Date.now function
Date.now = () => 1511164339200;

// Tell jest to mock all timers
jest.useFakeTimers();

describe("Uptime component", () => {
  let UptimeWrapper;
  beforeEach(() => {
    UptimeWrapper = mount(<Uptime startTime={startTime} render={renderFunc} />);
  });

  test("renders via the function passed as the render prop", () => {
    expect(UptimeWrapper.find(ArrayValue)).toHaveLength(1);
  });

  test("renders the correct value", () => {
    jest.runTimersToTime(1000);
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
