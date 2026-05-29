import React from "react";
import { render, fireEvent, screen } from "@testing-library/react";

import ThreadsTableLineItem from "./index";

// import Actions
import "services";

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

describe("ThreadsTableLineItem component", () => {
  test("Matched the snapshot", () => {
    const { asFragment } = render(<ThreadsTableLineItem {...mockProps} />);
    expect(asFragment()).toMatchSnapshot();
  });

  // The enzyme test read the component's private `isOpen` state directly. RTL is
  // DOM-based, so we assert on isOpen's visible manifestation instead: the drawer
  // is rendered through TableDrawerCollapse -> react-collapse's UnmountClosed.
  // While closed-from-the-start it renders nothing, so the collapse wrapper
  // (.ReactCollapse--collapse) is absent. Opening mounts that wrapper with
  // aria-hidden="false"; closing again flips it to aria-hidden="true". (The wrapper
  // and its stack-trace content are NOT removed on close in jsdom, because
  // UnmountClosed only unmounts after a CSS transition that never fires here, but
  // aria-hidden flips synchronously with isOpen, so it is the reliable proxy.)
  test("should toggle row's open/closed state when row is clicked", () => {
    const { container } = render(<ThreadsTableLineItem {...mockProps} />);

    // The row's onClick runs blurTableRow, which walks up from the event target
    // looking for an ancestor whose className starts with "TableRow" and calls
    // .blur() on it. The original enzyme test simulated a synthetic event whose
    // target.className was "TableRow"; the real styled-component className does
    // not start with "TableRow" (and is re-applied on every render), so we tag
    // the RTL mount container (an ancestor React never re-renders) to give
    // blurTableRow its terminating node and avoid walking past document to null.
    container.className = "TableRow";

    const row = screen.getByRole("link");

    // Drawer starts closed: UnmountClosed has not mounted the collapse wrapper.
    expect(container.querySelector(".ReactCollapse--collapse")).toBeNull();

    fireEvent.click(row);
    // Drawer open.
    expect(container.querySelector(".ReactCollapse--collapse")).toHaveAttribute(
      "aria-hidden",
      "false"
    );

    fireEvent.click(row);
    // Drawer closed again.
    expect(container.querySelector(".ReactCollapse--collapse")).toHaveAttribute(
      "aria-hidden",
      "true"
    );
  });
});
