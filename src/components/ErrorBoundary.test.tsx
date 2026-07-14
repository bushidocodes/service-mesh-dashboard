import { render } from "@testing-library/react";
import ErrorBoundary from "./ErrorBoundary";

describe("ErrorBoundary", () => {
  it("matches snapshot", () => {
    const { asFragment } = render(<ErrorBoundary />);
    expect(asFragment()).toMatchSnapshot();
  });
});
