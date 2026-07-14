import { render } from "@testing-library/react";
import HttpPatch from "./HttpPatch";

describe("HttpPatch", () => {
  it("matches snapshot", () => {
    const { asFragment } = render(
      <svg>
        <HttpPatch />
      </svg>
    );
    expect(asFragment()).toMatchSnapshot();
  });
});
