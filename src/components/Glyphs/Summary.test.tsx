import { render } from "@testing-library/react";
import Summary from "./Summary";

describe("Summary", () => {
  it("matches snapshot", () => {
    const { asFragment } = render(
      <svg>
        <Summary />
      </svg>
    );
    expect(asFragment()).toMatchSnapshot();
  });
});
