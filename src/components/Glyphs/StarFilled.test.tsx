import { render } from "@testing-library/react";
import StarFilled from "./StarFilled";

describe("StarFilled", () => {
  it("matches snapshot", () => {
    const { asFragment } = render(
      <svg>
        <StarFilled />
      </svg>
    );
    expect(asFragment()).toMatchSnapshot();
  });
});
