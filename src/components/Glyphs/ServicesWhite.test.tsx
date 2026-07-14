import { render } from "@testing-library/react";
import ServicesWhite from "./ServicesWhite";

describe("ServicesWhite", () => {
  it("matches snapshot", () => {
    const { asFragment } = render(
      <svg>
        <ServicesWhite />
      </svg>
    );
    expect(asFragment()).toMatchSnapshot();
  });
});
