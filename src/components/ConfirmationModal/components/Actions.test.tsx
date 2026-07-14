import { render } from "@testing-library/react";
import React from "react";
import Actions from "./Actions";

describe("Actions", () => {
  it("matches snapshot", () => {
    const { asFragment } = render(<Actions />);
    expect(asFragment()).toMatchSnapshot();
  });
});
