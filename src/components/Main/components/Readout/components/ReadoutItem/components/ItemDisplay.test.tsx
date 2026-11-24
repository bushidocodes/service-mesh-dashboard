import { render } from "@testing-library/react";
import ItemDisplay from "./ItemDisplay";

describe("ItemDisplay", () => {
  it("matches snapshot", () => {
    const { asFragment } = render(<ItemDisplay />);
    expect(asFragment()).toMatchSnapshot();
  });
  // `-webkit-flex: 1 1 0` is declared after the flex prop and is an alias of
  // flex. jsdom 31 applies that alias, so the used value is 1 1 0px.
  it("computes flex from the trailing -webkit-flex alias", () => {
    const { container } = render(<ItemDisplay flex="0 1 33%" />);
    expect(container.firstChild).toHaveStyle({ flex: "1 1 0px" });
  });
});
