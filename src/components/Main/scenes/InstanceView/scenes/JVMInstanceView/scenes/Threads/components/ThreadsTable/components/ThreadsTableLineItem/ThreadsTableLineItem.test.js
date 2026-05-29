import React from "react";
import { mount, shallow } from "enzyme";

import ThreadsTableLineItem from "./index";
import TableRow from "components/Main/components/TableRow";

// import Actions
import "services";

let ThreadsTableLineItemWrap;
const mockProps = {
  daemon: true,
  id: 11,
  name: "finagle/netty3-7",
  priority: 10,
  stack: [
    "sun.nio.ch.EPollArrayWrapper.epollWait(Native Method)",
    "sun.nio.ch.EPollArrayWrapper.poll(EPollArrayWrapper.java:269)",
    "sun.nio.ch.EPollSelectorImpl.doSelect(EPollSelectorImpl.java:93)"
  ],
  state: "WAITING"
};

const mockedEvent = {
  target: {
    className: "TableRow",
    blur: () => {}
  }
};

describe("ThreadsTableLineItem component", () => {
  beforeEach(() => {
    ThreadsTableLineItemWrap = mount(<ThreadsTableLineItem {...mockProps} />);
  });

  test("Matched the snapshot", () => {
    expect(ThreadsTableLineItemWrap).toMatchSnapshot();
  });

  // use 'shallow' instead of mount for instance tests
  test("should toggle row's open/closed state when row is clicked", () => {
    ThreadsTableLineItemWrap = shallow(<ThreadsTableLineItem {...mockProps} />);

    const row = ThreadsTableLineItemWrap.find(TableRow);
    row.simulate("click", mockedEvent);

    expect(ThreadsTableLineItemWrap.state().isOpen).toEqual(true);

    row.simulate("click", mockedEvent);
    expect(ThreadsTableLineItemWrap.state().isOpen).toEqual(false);
  });
});
