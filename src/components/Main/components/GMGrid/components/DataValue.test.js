import React from "react";
import { render } from "@testing-library/react";
import DataValue from "./DataValue";

describe("DataValue", () => {
  it("matches snapshot", () => {
    const { asFragment } = render(<DataValue />);
    expect(asFragment()).toMatchSnapshot();
  });
});
