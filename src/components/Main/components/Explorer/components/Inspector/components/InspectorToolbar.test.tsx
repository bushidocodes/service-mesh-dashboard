import React from "react";
import { render } from "@testing-library/react";
import InspectorToolbar from "./InspectorToolbar";

describe("InspectorToolbar", () => {
  it("matches snapshot", () => {
    const { asFragment } = render(<InspectorToolbar />);
    expect(asFragment()).toMatchSnapshot();
  });
});
