import { render } from "@testing-library/react";
import StyledModal from "./StyledModal";

describe("StyledModal", () => {
  it("matches snapshot", () => {
    const { asFragment } = render(<StyledModal />);
    expect(asFragment()).toMatchSnapshot();
  });
});
