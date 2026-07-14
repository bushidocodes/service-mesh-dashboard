import { render } from "@testing-library/react";
import React from "react";
import InspectorSearch from "./InspectorSearch";

describe("InspectorSearch", () => {
  it("matches snapshot", () => {
    const { asFragment } = render(<InspectorSearch />);
    expect(asFragment()).toMatchSnapshot();
  });
});
