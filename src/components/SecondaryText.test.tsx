import { render } from "@testing-library/react";
import SecondaryText from "./SecondaryText";

describe("SecondaryText", () => {
  it("matches snapshot", () => {
    const { asFragment } = render(<SecondaryText />);
    expect(asFragment()).toMatchSnapshot();
  });
});
