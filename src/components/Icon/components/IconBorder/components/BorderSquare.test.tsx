import { render } from "@testing-library/react";
import BorderSquare from "./BorderSquare";

describe("BorderSquare", () => {
  it("matches snapshot", () => {
    const { asFragment } = render(
      <svg>
        <BorderSquare />
      </svg>
    );
    expect(asFragment()).toMatchSnapshot();
  });
});
