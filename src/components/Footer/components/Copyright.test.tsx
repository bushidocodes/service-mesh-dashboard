import { render } from "@testing-library/react";
import Copyright from "./Copyright";

describe("Copyright", () => {
  it("should render when screen is 800px or higher", () => {
    const { asFragment } = render(<Copyright />);
    expect(asFragment()).toMatchSnapshot();
  });

  // order: 3 below 800px, order: initial at 800px and up. jsdom's CSS
  // viewport is fixed at 1024px, so the min-width query matches and initial
  // computes to 0. The snapshot above still records both rule sets.
  it("uses the inline layout at jsdom's 1024px viewport", () => {
    const { container } = render(<Copyright />);
    expect(container.firstChild).toHaveStyle({ order: "0" });
  });
});
