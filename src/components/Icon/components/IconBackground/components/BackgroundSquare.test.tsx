import { render } from "@testing-library/react";
import BackgroundSquare from "./BackgroundSquare";

describe("BackgroundSquare", () => {
  it("matches snapshot", () => {
    const { asFragment } = render(
      <svg>
        <BackgroundSquare />
      </svg>
    );
    expect(asFragment()).toMatchSnapshot();
  });
});
