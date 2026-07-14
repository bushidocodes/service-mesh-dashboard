import { render } from "@testing-library/react";
import Finagle from "./Finagle";

describe("Finagle", () => {
  it("matches snapshot", () => {
    const { asFragment } = render(
      <svg>
        <Finagle />
      </svg>
    );
    expect(asFragment()).toMatchSnapshot();
  });
});
