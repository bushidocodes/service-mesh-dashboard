import { render } from "@testing-library/react";
import Scale from "./Scale";

describe("Scale", () => {
  it("matches snapshot", () => {
    const { asFragment } = render(
      <svg>
        <Scale />
      </svg>
    );
    expect(asFragment()).toMatchSnapshot();
  });
});
