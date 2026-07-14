import { render } from "@testing-library/react";
import NoMetrics from "./NoMetrics";

describe("NoMetrics", () => {
  it("matches snapshot", () => {
    const { asFragment } = render(
      <svg>
        <NoMetrics />
      </svg>
    );
    expect(asFragment()).toMatchSnapshot();
  });
});
