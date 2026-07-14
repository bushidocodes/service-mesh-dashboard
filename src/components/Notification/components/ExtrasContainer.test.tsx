import { render } from "@testing-library/react";
import React from "react";
import ExtrasContainer from "./ExtrasContainer";

describe("ExtrasContainer", () => {
  it("matches snapshot", () => {
    const { asFragment } = render(<ExtrasContainer />);
    expect(asFragment()).toMatchSnapshot();
  });
});
