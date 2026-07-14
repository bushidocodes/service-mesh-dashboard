import { render } from "@testing-library/react";
import EKG from "./EKG";

describe("EKG", () => {
  it("matches snapshot", () => {
    const { asFragment } = render(
      <svg>
        <EKG />
      </svg>
    );
    expect(asFragment()).toMatchSnapshot();
  });
});
