import React from "react";
import { fireEvent, screen } from "@testing-library/react";
import { mountWithIntl, renderWithIntl } from "utils/i18nTesting";

import Inspector from "./Inspector";

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
  onChange: () => {},
  onSearch: jest.fn(),
  searchQuery: "",
  selectedMetric: null as unknown as string | undefined
};

// The list (InspectorData) renders a <ul> and each InspectorItem renders a
// focusable <div tabIndex="0"> whose text content is the metric key. RTL is
// DOM-based, so we count/inspect those rendered nodes directly.
const getItems = (container: HTMLElement): Element[] => {
  const list = container.querySelector("ul");
  return list ? Array.from(list.children) : [];
};

describe("Inspector", () => {
  let container: HTMLElement;
  beforeEach(() => {
    ({ container } = mountWithIntl(<Inspector {...mockProps} />));
  });

  test("matches snapshot", () => {
    const { asFragment } = renderWithIntl(<Inspector {...mockProps} />);
    expect(asFragment()).toMatchSnapshot();
  });

  test("renders data", () => {
    const items = getItems(container);
    expect(items).toHaveLength(14);
    items.forEach((item, idx) => {
      expect(item).toHaveTextContent(mockData[idx]);
    });
  });

  test("does not render a ul when there is no data", () => {
    expect(container.querySelectorAll("ul")).toHaveLength(1);
    const { container: emptyContainer } = renderWithIntl(
      <Inspector {...mockProps} data={[]} />
    );
    expect(emptyContainer.querySelectorAll("ul")).toHaveLength(0);
  });

  test("calls onSearch when user inputs search query", () => {
    // InspectorSearch renders the <input type="search"> exposed as a searchbox.
    const searchInput = screen.getByRole("searchbox");
    fireEvent.change(searchInput, { target: { value: "http" } });
    expect(mockProps.onSearch).toHaveBeenCalled();
  });

  test("calls onClick when user selects a metric", () => {
    const items = getItems(container);
    fireEvent.click(items[0]);
    expect(mockProps.onClick).toHaveBeenCalled();
  });

  test("passes active prop to the selected metric's styled-component", () => {
    // The `active` prop on InspectorItem manifests as a styled-component branch
    // that, among other rules, sets `z-index: 999999` (unique to the active
    // state). Inactive items have no items carrying that rule.
    // NOTE: the original `findWhere(item => item.props().active)` inspected the
    // React `active` prop directly; RTL cannot read props, so we assert the
    // observable style the prop produces instead.
    getItems(container).forEach((item) => {
      expect(item).not.toHaveStyleRule("z-index", "999999");
    });

    // Set a selected metric and look for the item carrying the active style.
    const { container: activeContainer } = renderWithIntl(
      <Inspector {...mockProps} selectedMetric="http/closes" />
    );
    const activeItems = getItems(activeContainer).filter(
      (item) => item.textContent === "http/closes"
    );
    expect(activeItems).toHaveLength(1);
    expect(activeItems[0]).toHaveTextContent("http/closes");
    expect(activeItems[0]).toHaveStyleRule("z-index", "999999");
    // No other item carries the active style.
    getItems(activeContainer)
      .filter((item) => item.textContent !== "http/closes")
      .forEach((item) => {
        expect(item).not.toHaveStyleRule("z-index", "999999");
      });
  });

  test("filters data by searchQuery", () => {
    const { container: filteredContainer } = renderWithIntl(
      <Inspector {...mockProps} searchQuery="finagle" />
    );
    const items = getItems(filteredContainer);
    expect(items).toHaveLength(7);
    items.forEach((item, idx) => {
      expect(item).toHaveTextContent(mockData[idx]);
    });
  });
});
