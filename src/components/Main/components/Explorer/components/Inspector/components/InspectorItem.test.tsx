import { render } from "@testing-library/react";
import React from "react";
import InspectorItem from "./InspectorItem";

describe("InspectorItem", () => {
  it("matches snapshot", () => {
    const { asFragment } = render(<InspectorItem />);
    expect(asFragment()).toMatchSnapshot();
  });
});
