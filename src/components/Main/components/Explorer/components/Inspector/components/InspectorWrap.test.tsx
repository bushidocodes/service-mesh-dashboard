import React from "react";
import { render } from "@testing-library/react";
import InspectorWrap from "./InspectorWrap";

describe("InspectorWrap", () => {
  it("matches snapshot", () => {
    const { asFragment } = render(<InspectorWrap />);
    expect(asFragment()).toMatchSnapshot();
  });
});
