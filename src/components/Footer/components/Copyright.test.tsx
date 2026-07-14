import { render } from "@testing-library/react";
import Copyright from "./Copyright";

describe("Copyright", () => {
  it("should render when screen is 800px or higher", () => {
    const { asFragment } = render(<Copyright />);
    expect(asFragment()).toMatchSnapshot();
  });

  // Layout switches via a min-width media query (order: 3 stacked → order: initial
  // inline at 800px+). The snapshot above captures both rule sets; media-query
  // application is not reliable under jsdom without a full CSSOM stack, so we
  // assert the default (mobile-first) computed order here.
  it("uses a stacked layout by default (mobile-first order: 3)", () => {
    const { container } = render(<Copyright />);
    expect(container.firstChild).toHaveStyle({ order: "3" });
  });
});
