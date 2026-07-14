import { render } from "@testing-library/react";
import ReadoutItemData from "./ReadoutItemData";

describe("ReadoutItemData", () => {
  it("matches snapshot", () => {
    const { asFragment } = render(<ReadoutItemData />);
    expect(asFragment()).toMatchSnapshot();
  });
  it("allows padding-left of first-child to be overridden", () => {
    const { container } = render(<ReadoutItemData paddingLeft="99px" />);
    // &:first-child padding-left override; the root is the first child of RTL's
    // container, so getComputedStyle picks up the rule via toHaveStyle.
    expect(container.firstChild).toHaveStyle({ paddingLeft: "99px" });
  });
});
