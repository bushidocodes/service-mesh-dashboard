import React from "react";
import { mountWithIntl, renderWithIntl } from "utils/i18nTesting";

import Inspector from "./Inspector";
import InspectorItem from "./components/InspectorItem";
import InspectorSearch from "./components/InspectorSearch";

const mockData = [
  "finagle/build/revision",
  "finagle/clientregistry/initialresolution_ms",
  "finagle/clientregistry/size",
  "finagle/future_pool/active_tasks",
  "finagle/future_pool/completed_tasks",
  "finagle/future_pool/pool_size",
  "finagle/timer/deviation_ms.avg",
  "http/closes",
  "http/connection_duration.count",
  "http/connection_received_bytes.count",
  "http/connection_requests.count",
  "http/connection_sent_bytes.count",
  "http/connections",
  "http/connects"
];

const mockProps = {
  data: mockData,
  onClick: jest.fn(),
  onSearch: jest.fn(),
  searchQuery: "",
  selectedMetric: null
};

describe("Inspector", () => {
  let wrapper;
  beforeEach(() => {
    wrapper = mountWithIntl(<Inspector {...mockProps} />);
  });

  test("matches snapshot", () => {
    const tree = renderWithIntl(<Inspector {...mockProps} />);
    expect(tree).toMatchSnapshot();
  });

  test("renders data", () => {
    expect(wrapper.find(InspectorItem)).toHaveLength(14);
    wrapper.find(InspectorItem).forEach((item, idx) => {
      expect(item.text()).toBe(mockData[idx]);
    });
  });

  test("does not render a ul when there is no data", () => {
    expect(wrapper.find("ul")).toHaveLength(1);
    wrapper.setProps({ data: [] });
    expect(wrapper.find("ul")).toHaveLength(0);
  });

  test("calls onSearch when user inputs search query", () => {
    wrapper.find(InspectorSearch).simulate("change");
    expect(wrapper.props().onSearch).toHaveBeenCalled();
  });

  test("calls onClick when user selects a metric", () => {
    wrapper.find(InspectorItem).first().simulate("click");
    expect(wrapper.props().onClick).toHaveBeenCalled();
  });

  test("passes active prop to the selected metric's styled-component", () => {
    // Function that returns the ReactWrapper of any element(s) with an "active" prop
    const findActiveItem = () =>
      wrapper.findWhere((item) => item.props().active);
    expect(findActiveItem()).toHaveLength(0);

    // Set a selected metric and search for item with active prop again
    wrapper.setProps({ selectedMetric: "http/closes" });
    expect(findActiveItem()).toHaveLength(1);
    expect(findActiveItem().text()).toBe("http/closes");
  });

  test("filters data by searchQuery", () => {
    wrapper.setProps({ searchQuery: "finagle" });
    expect(wrapper.find(InspectorItem)).toHaveLength(7);
    wrapper.find(InspectorItem).forEach((item, idx) => {
      expect(item.text()).toBe(mockData[idx]);
    });
  });
});
