import { render } from "@testing-library/react";
import React from "react";
import ReadoutItemValue from "./ReadoutItemValue";

describe("ReadoutItemValue", () => {
  it("matches snapshot", () => {
    const { asFragment } = render(<ReadoutItemValue />);
    expect(asFragment()).toMatchSnapshot();
  });
});
