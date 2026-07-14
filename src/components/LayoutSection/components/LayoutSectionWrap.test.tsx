import { render } from "@testing-library/react";
import LayoutSectionWrap from "./LayoutSectionWrap";

describe("LayoutSectionWrap", () => {
  it("matches snapshot", () => {
    const { asFragment } = render(<LayoutSectionWrap />);
    expect(asFragment()).toMatchSnapshot();
  });
});
