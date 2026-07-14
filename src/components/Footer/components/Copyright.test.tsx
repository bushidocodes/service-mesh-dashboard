import { render } from "@testing-library/react";
import React from "react";
import Copyright from "./Copyright";

describe("Copyright", () => {
  it("should render when screen is 800px or higher", () => {
    const { asFragment } = render(<Copyright />);
    expect(asFragment()).toMatchSnapshot();
  });

  // The component is always rendered; it only changes layout responsively.
  // Below 800px it is pushed to the bottom of the footer (order: 3); at 800px+
  // it rejoins the inline layout (order: initial).
  it("uses a stacked layout below 800px and an inline layout at 800px and up", () => {
    const { container } = render(<Copyright />);
    expect(container.firstChild).toHaveStyleRule("order", "3");
    expect(container.firstChild).toHaveStyleRule("order", "initial", {
      media: "all and (min-width: 800px)"
    });
  });
});
