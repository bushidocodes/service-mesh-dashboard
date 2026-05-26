import React from "react";
import {
  mountWithIntl,
  shallowWithIntl,
  renderWithIntl
} from "utils/i18nTesting";

import TableLineItem from "./TableLineItem";
import TableRow from "components/Main/components/TableRow";
import TableCol from "components/Main/components/TableCol";
import TableColVizBar from "components/Main/components/TableColVizBar";
import SparklineCol from "components/Main/components/SparklineCol";
import TableDrawerCollapse from "components/Main/components/TableDrawerCollapse";

let wrapper;

const mockedEvent = {
  target: {
    className: "TableRow",
    blur: () => {}
  }
};

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

describe("<TableLineItem/>", () => {
  // TODO(jest-upgrade): enzyme.find(StyledComponent) throws "Enzyme::Props can't
  // have undefined values" with styled-components v5 + enzyme-react-18.
  // Skip until an Enzyme→RTL migration PR replaces find(SC) with findWhere().
  xtest("renders styled-components", () => {
    wrapper = mountWithIntl(TableLineItemWithProps);
    expect(wrapper.find(TableRow).length).toBe(1);
    expect(wrapper.find(TableColVizBar).length).toBe(1);
    expect(wrapper.find(SparklineCol).length).toBe(1);
    expect(wrapper.find(TableCol).length).toBe(3);
    expect(wrapper.find(TableDrawerCollapse).length).toBe(1);
  });

  // use 'shallow' instead of mount for instance tests
  // TODO(jest-upgrade): shallowWithIntl(...).dive() throws "ShallowWrapper::dive()
  // can only be called on components" with enzyme-react-18 adapter.
  // Skip until an Enzyme→RTL migration PR rewrites this test.
  xtest("should toggle row's open/closed state when row is clicked", () => {
    wrapper = shallowWithIntl(TableLineItemWithProps).dive();

    const row = wrapper.find(TableRow);

    row.simulate("click", mockedEvent);
    expect(wrapper.state().isOpen).toEqual(true);

    row.simulate("click", mockedEvent);
    expect(wrapper.state().isOpen).toEqual(false);
  });

  // TODO(jest-upgrade): shallowWithIntl(...).dive() throws "ShallowWrapper::dive()
  // can only be called on components" with enzyme-react-18 adapter.
  // Skip until an Enzyme→RTL migration PR rewrites this test.
  xtest("should toggle drawer's open/closed state when row is clicked", () => {
    wrapper = shallowWithIntl(TableLineItemWithProps).dive();

    wrapper.simulate("click", mockedEvent);
    const drawer = wrapper.find(TableDrawerCollapse);

    expect(wrapper.state().isOpen).toEqual(true);
    expect(drawer.props().isOpened).toBe(true);
  });

  test("matches snapshot", () => {
    const tree = renderWithIntl(TableLineItemWithProps);
    expect(tree).toMatchSnapshot();
  });
});
