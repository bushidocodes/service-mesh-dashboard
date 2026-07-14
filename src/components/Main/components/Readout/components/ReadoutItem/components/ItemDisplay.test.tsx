import { render } from "@testing-library/react";
import React from "react";
import ItemDisplay from "./ItemDisplay";

describe("ItemDisplay", () => {
  it("matches snapshot", () => {
    const { asFragment } = render(<ItemDisplay />);
    expect(asFragment()).toMatchSnapshot();
  });
  it("allows flex value to be overridden", () => {
    const { container } = render(<ItemDisplay flex="0 1 33%" />);
    expect(container.firstChild).toHaveStyleRule("flex", "0 1 33%");
  });
});
