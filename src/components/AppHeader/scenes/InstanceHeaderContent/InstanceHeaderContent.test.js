import React from "react";
import { render, screen } from "@testing-library/react";

import state from "json/mockReduxState";

// Unconnected named export so we can drive the runtime switch directly via props
// rather than through connect()+injectIntl(); the connected default export wires
// `runtime` from state.fabric.services[selectedServiceSlug].runtime.
import { InstanceHeaderContent } from "./InstanceHeaderContent";
import JVMHeaderContent from "./scenes/JVMHeaderContent";
import GoHeaderContent from "./scenes/GoHeaderContent";
import DefaultHeaderContent from "./scenes/DefaultHeaderContent";

// InstanceHeaderContent is a runtime switch that renders exactly ONE of three
// child scenes. Enzyme asserted this via .find(Component)/.props(); RTL is
// DOM-based, so each scene is replaced with an identifiable stub (jest.fn) and
// we assert which stub mounts — and, for the prop-passing test, inspect the
// props the active stub received. This mirrors the original shallow intent.
jest.mock("./scenes/JVMHeaderContent", () => {
  const React = require("react");
  return jest.fn(() =>
    React.createElement("div", { "data-testid": "jvm-header" })
  );
});
jest.mock("./scenes/GoHeaderContent", () => {
  const React = require("react");
  return jest.fn(() =>
    React.createElement("div", { "data-testid": "go-header" })
  );
});
jest.mock("./scenes/DefaultHeaderContent", () => {
  const React = require("react");
  return jest.fn(() =>
    React.createElement("div", { "data-testid": "default-header" })
  );
});

// renderTabs() calls intl.formatMessage() on message descriptors
// ({ id, defaultMessage }) drawn from the dashboards fixture; this mock echoes
// the default message (and tolerates plain strings).
const intl = {
  formatMessage: (message) =>
    typeof message === "string"
      ? message
      : (message && (message.defaultMessage || message.id)) || ""
};

const baseProps = {
  basePath: "/go-exemplar-v1-0/2smao7xwboy0000000000",
  dashboards: state.dashboards,
  metrics: state.instance.metrics,
  intl
};

describe("InstanceHeaderContent", () => {
  beforeEach(() => {
    JVMHeaderContent.mockClear();
    GoHeaderContent.mockClear();
    DefaultHeaderContent.mockClear();
  });

  test("returns JVMHeaderContent when runtime prop is JVM", () => {
    render(<InstanceHeaderContent {...baseProps} runtime="JVM" />);
    expect(screen.getByTestId("jvm-header")).toBeInTheDocument();
    expect(screen.queryByTestId("go-header")).not.toBeInTheDocument();
    expect(screen.queryByTestId("default-header")).not.toBeInTheDocument();
  });

  test("returns GoHeaderContent when runtime prop is GO", () => {
    render(<InstanceHeaderContent {...baseProps} runtime="GO" />);
    expect(screen.getByTestId("go-header")).toBeInTheDocument();
    expect(screen.queryByTestId("jvm-header")).not.toBeInTheDocument();
    expect(screen.queryByTestId("default-header")).not.toBeInTheDocument();
  });

  test("returns DefaultHeaderContent for an unrecognized runtime", () => {
    render(<InstanceHeaderContent {...baseProps} runtime="" />);
    expect(screen.getByTestId("default-header")).toBeInTheDocument();
    expect(screen.queryByTestId("jvm-header")).not.toBeInTheDocument();
    expect(screen.queryByTestId("go-header")).not.toBeInTheDocument();
  });

  test("passes basePath, metrics, and a tab per dashboard to the active runtime view", () => {
    render(<InstanceHeaderContent {...baseProps} runtime="GO" />);
    // The active scene receives basePath, metrics, and the renderTabs() output.
    const props = GoHeaderContent.mock.calls[0][0];

    expect(props.basePath).toBe(baseProps.basePath);
    expect(props.metrics).toBe(state.instance.metrics);
    // renderTabs() emits one <Tab> per dashboard (http, jvm, finagle).
    expect(props.headerTabs).toHaveLength(Object.keys(state.dashboards).length);
  });
});
