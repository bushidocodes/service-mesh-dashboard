import { render } from "@testing-library/react";
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

  // hideRoot styles the first child via `> li:first-child { hide }`. Assert on
  // that child's computed styles rather than jest-styled-components modifiers.
  it("hides the first child when passed the hideRoot prop", () => {
    const { container } = render(
      <Breadcrumbs hideRoot>
        <li>Root</li>
        <li>Leaf</li>
      </Breadcrumbs>
    );
    const first = container.querySelector("li");
    expect(first).toHaveStyle({
      position: "absolute",
      visibility: "hidden",
      pointerEvents: "none"
    });
  });

  it("does not hide the first child without the hideRoot prop", () => {
    const { container } = render(
      <Breadcrumbs>
        <li>Root</li>
        <li>Leaf</li>
      </Breadcrumbs>
    );
    const first = container.querySelector("li");
    expect(first).not.toHaveStyle({ visibility: "hidden" });
  });
});
