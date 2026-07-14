import { render } from "@testing-library/react";
import Close from "./Close";

describe("Close", () => {
  it("matches snapshot", () => {
    const { asFragment } = render(
      <svg>
        <Close />
      </svg>
    );
    expect(asFragment()).toMatchSnapshot();
  });
});
