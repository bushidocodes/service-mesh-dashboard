import { render } from "@testing-library/react";
import DismissButton from "./DismissButton";

describe("DismissButton", () => {
  it("matches snapshot", () => {
    const { asFragment } = render(<DismissButton />);
    expect(asFragment()).toMatchSnapshot();
  });
});
