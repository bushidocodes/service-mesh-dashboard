import { render } from "@testing-library/react";
import BackgroundCircleSmall from "./BackgroundCircleSmall";

describe("BackgroundCircleSmall", () => {
  it("matches snapshot", () => {
    const { asFragment } = render(
      <svg>
        <BackgroundCircleSmall />
      </svg>
    );
    expect(asFragment()).toMatchSnapshot();
  });
});
