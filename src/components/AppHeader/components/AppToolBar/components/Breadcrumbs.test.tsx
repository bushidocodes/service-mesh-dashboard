import { render } from "@testing-library/react";
import React from "react";
import Breadcrumbs from "./Breadcrumbs";

describe("Breadcrumbs", () => {
  it("matches snapshot when showing root", () => {
    const { asFragment } = render(<Breadcrumbs />);
    expect(asFragment()).toMatchSnapshot();
  });
  it("matches snapshot when hiding root", () => {
    const { asFragment } = render(<Breadcrumbs hideRoot />);
    expect(asFragment()).toMatchSnapshot();
  });
  // The hideRoot styling is applied via the `> li:first-child` child selector.
  // jest-styled-components can assert on nested selectors through the `modifier`
  // option, so we no longer need to mount real <Breadcrumb> children.
  it("hides the first child when passed the hideRoot prop", () => {
    const { container } = render(<Breadcrumbs hideRoot />);
    const modifier = { modifier: "> li:first-child" };
    expect(container.firstChild).toHaveStyleRule(
      "position",
      "absolute",
      modifier
    );
    expect(container.firstChild).toHaveStyleRule(
      "visibility",
      "hidden",
      modifier
    );
    expect(container.firstChild).toHaveStyleRule(
      "pointer-events",
      "none",
      modifier
    );
  });

  it("does not hide the first child without the hideRoot prop", () => {
    const { container } = render(<Breadcrumbs />);
    expect(container.firstChild).not.toHaveStyleRule("visibility", "hidden", {
      modifier: "> li:first-child"
    });
  });
});
