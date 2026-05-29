import React from "react";
import { render } from "@testing-library/react";
import AppToolBarHeader from "./AppToolBarHeader";

describe("AppToolBarHeader", () => {
  it("matches snapshot", () => {
    const { asFragment } = render(<AppToolBarHeader />);
    expect(asFragment()).toMatchSnapshot();
  });
});
