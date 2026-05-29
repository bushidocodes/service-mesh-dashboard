import React from "react";
import { render } from "@testing-library/react";
import ButtonGroup from "./ButtonGroup";

describe("ButtonGroup", () => {
  it("matches snapshot when toolbar props is passed", () => {
    const { asFragment } = render(<ButtonGroup toolbar />);
    expect(asFragment()).toMatchSnapshot();
  });
  it("matches snapshot when toolbar props is not passed", () => {
    const { asFragment } = render(<ButtonGroup />);
    expect(asFragment()).toMatchSnapshot();
  });
});
