import { render } from "@testing-library/react";
import HeaderContainer from "./HeaderContainer";

describe("HeaderContainer", () => {
  it("matches snapshot", () => {
    const { asFragment } = render(<HeaderContainer />);
    expect(asFragment()).toMatchSnapshot();
  });
});
