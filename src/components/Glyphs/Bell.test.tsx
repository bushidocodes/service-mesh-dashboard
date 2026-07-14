import { render } from "@testing-library/react";
import Bell from "./Bell";

describe("Bell", () => {
  it("matches snapshot", () => {
    const { asFragment } = render(
      <svg>
        <Bell />
      </svg>
    );
    expect(asFragment()).toMatchSnapshot();
  });
});
