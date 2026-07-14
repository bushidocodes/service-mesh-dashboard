import { render } from "@testing-library/react";
import StyledG from "./StyledG";

describe("StyledG", () => {
  it("matches snapshot", () => {
    const { asFragment } = render(
      <svg>
        <StyledG />
      </svg>
    );
    expect(asFragment()).toMatchSnapshot();
  });
});
