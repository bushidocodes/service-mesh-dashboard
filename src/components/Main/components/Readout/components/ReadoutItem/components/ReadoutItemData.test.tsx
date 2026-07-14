import { render } from "@testing-library/react";
import React from "react";
import ReadoutItemData from "./ReadoutItemData";

describe("ReadoutItemData", () => {
  it("matches snapshot", () => {
    const { asFragment } = render(<ReadoutItemData />);
    expect(asFragment()).toMatchSnapshot();
  });
  it("allows padding-left of first-child to be overridden", () => {
    const { container } = render(<ReadoutItemData paddingLeft="99px" />);
    // The override applies to padding-left under the :first-child selector;
    // jest-styled-components targets nested rules via the `modifier` option.
    expect(container.firstChild).toHaveStyleRule("padding-left", "99px", {
      modifier: ":first-child"
    });
  });
});
