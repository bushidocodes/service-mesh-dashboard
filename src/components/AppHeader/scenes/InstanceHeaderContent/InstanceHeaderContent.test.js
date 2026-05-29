import React from "react";
import { shallow } from "enzyme";

import state from "json/mockReduxState";

// Unconnected named export so we can drive the runtime switch directly via props
// rather than through connect()+injectIntl(); the connected default export wires
// `runtime` from state.fabric.services[selectedServiceSlug].runtime.
import { InstanceHeaderContent } from "./InstanceHeaderContent";
import JVMHeaderContent from "./scenes/JVMHeaderContent";
import GoHeaderContent from "./scenes/GoHeaderContent";
import DefaultHeaderContent from "./scenes/DefaultHeaderContent";

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
  test("returns JVMHeaderContent when runtime prop is JVM", () => {
    const wrapper = shallow(
      <InstanceHeaderContent {...baseProps} runtime="JVM" />
    );
    expect(wrapper.find(JVMHeaderContent)).toHaveLength(1);
    expect(wrapper.find(GoHeaderContent)).toHaveLength(0);
    expect(wrapper.find(DefaultHeaderContent)).toHaveLength(0);
  });

  test("returns GoHeaderContent when runtime prop is GO", () => {
    const wrapper = shallow(
      <InstanceHeaderContent {...baseProps} runtime="GO" />
    );
    expect(wrapper.find(GoHeaderContent)).toHaveLength(1);
    expect(wrapper.find(JVMHeaderContent)).toHaveLength(0);
    expect(wrapper.find(DefaultHeaderContent)).toHaveLength(0);
  });

  test("returns DefaultHeaderContent for an unrecognized runtime", () => {
    const wrapper = shallow(
      <InstanceHeaderContent {...baseProps} runtime="" />
    );
    expect(wrapper.find(DefaultHeaderContent)).toHaveLength(1);
    expect(wrapper.find(JVMHeaderContent)).toHaveLength(0);
    expect(wrapper.find(GoHeaderContent)).toHaveLength(0);
  });

  test("passes basePath, metrics, and a tab per dashboard to the active runtime view", () => {
    const wrapper = shallow(
      <InstanceHeaderContent {...baseProps} runtime="GO" />
    );
    const props = wrapper.find(GoHeaderContent).props();

    expect(props.basePath).toBe(baseProps.basePath);
    expect(props.metrics).toBe(state.instance.metrics);
    // renderTabs() emits one <Tab> per dashboard (http, jvm, finagle).
    expect(props.headerTabs).toHaveLength(Object.keys(state.dashboards).length);
  });
});
