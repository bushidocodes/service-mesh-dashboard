import { render } from "@testing-library/react";
import Span from "./Span";

describe("Span", () => {
  it("matches snapshot", () => {
    const { asFragment } = render(<Span />);
    expect(asFragment()).toMatchSnapshot();
  });
});
