import React from "react";
import { fireEvent, screen } from "@testing-library/react";
import { renderWithIntl } from "utils/i18nTesting";

import TableLineItem from "./TableLineItem";

const TableLineItemWithProps = (
  <TableLineItem
    errorPercent={"10.000"}
    errorsCount={32}
    item={"CatalogStream"}
    latency50={445}
    latency99={35}
    relativeReqPercent={20}
    requests={14333}
    requestsPerSecond_dygraph={{
      data: [
        [1193388, 1518054619229],
        [1193388, 1518054624225],
        [1193388, 1518054629230]
      ],
      attributes: ["http/requests"]
    }}
    requestsPerSecond_sparkline={[0, 25, 430, 1256]}
  />
);

// The TableRow handler calls blurTableRow(e), which walks up from e.target
// looking for a node whose className starts with "TableRow". With styled-
// components the rendered <li> only carries hashed classes (e.g. "sc-dhKdcB"),
// so a real click would crash. The original enzyme test sidestepped this by
// simulating with a mock event whose target.className was "TableRow". Here we
// reproduce that by prefixing the live <li>'s className before each click.
// Each render/re-render resets the className, so it must be re-applied.
const clickRow = (row) => {
  row.className = `TableRow ${row.className}`;
  fireEvent.click(row);
};

describe("<TableLineItem/>", () => {
  test("renders styled-components", () => {
    const { container } = renderWithIntl(TableLineItemWithProps);

    // TableRow renders a single <li role="link">.
    expect(screen.getAllByRole("link")).toHaveLength(1);

    // TableColVizBar renders the route name in its FlexParent.
    expect(screen.getByText("CatalogStream")).toBeInTheDocument();

    // SparklineCol renders the react-sparklines <svg preserveAspectRatio>.
    expect(container.querySelectorAll("svg[preserveAspectRatio]")).toHaveLength(
      1
    );

    // The three plain TableCol columns: requests, errorPercent, latency.
    expect(screen.getByText("14,333")).toBeInTheDocument();
    expect(screen.getByText("10.000%")).toBeInTheDocument();
    expect(screen.getByText("445 ms")).toBeInTheDocument();
    expect(screen.getByText("35 ms")).toBeInTheDocument();

    // NOTE: TableDrawerCollapse renders nothing while closed (lazy-mount), so we
    // assert on its absence as the proxy for "drawer present but collapsed".
    expect(container.querySelector(".drawer-collapse")).toBeNull();
  });

  test("should toggle row's open/closed state when row is clicked", () => {
    const { container } = renderWithIntl(TableLineItemWithProps);
    const row = screen.getByRole("link");

    // NOTE: state().isOpen is React-internal; we assert the observable result of
    // the toggle instead. TableDrawerCollapse renders nothing while initially
    // collapsed, expands with aria-hidden="false" when opened, and (in jsdom,
    // where the close transition never fires) keeps the element mounted but sets
    // aria-hidden="true" when closed again — so aria-hidden tracks isOpen.
    expect(container.querySelector(".drawer-collapse")).toBeNull();

    clickRow(row);
    expect(container.querySelector(".drawer-collapse")).toHaveAttribute(
      "aria-hidden",
      "false"
    );

    clickRow(row);
    expect(container.querySelector(".drawer-collapse")).toHaveAttribute(
      "aria-hidden",
      "true"
    );
  });

  test("should toggle drawer's open/closed state when row is clicked", () => {
    const { container } = renderWithIntl(TableLineItemWithProps);
    const row = screen.getByRole("link");

    clickRow(row);

    // NOTE: drawer.props().isOpened is not observable; assert the drawer's
    // rendered, expanded DOM (TableDrawerCollapse marks it aria-hidden="false").
    const drawer = container.querySelector(".drawer-collapse");
    expect(drawer).toBeInTheDocument();
    expect(drawer).toHaveAttribute("aria-hidden", "false");
  });

  test("matches snapshot", () => {
    const { asFragment } = renderWithIntl(TableLineItemWithProps);
    expect(asFragment()).toMatchSnapshot();
  });
});
