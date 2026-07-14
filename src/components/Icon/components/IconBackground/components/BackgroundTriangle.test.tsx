import { render } from "@testing-library/react";
import BackgroundTriangle from "./BackgroundTriangle";

describe("BackgroundTriangle", () => {
  it("matches snapshot", () => {
    const { asFragment } = render(
      <svg>
        <BackgroundTriangle />
      </svg>
    );
    expect(asFragment()).toMatchSnapshot();
  });
});
