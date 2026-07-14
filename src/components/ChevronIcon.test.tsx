import { render } from "@testing-library/react";
import ChevronIcon from "./ChevronIcon";

describe("ChevronIcon", () => {
  it("matches snapshot with no props", () => {
    const { asFragment } = render(<ChevronIcon />);
    expect(asFragment()).toMatchSnapshot();
  });
});
