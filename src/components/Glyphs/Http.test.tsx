import { render } from "@testing-library/react";
import Http from "./Http";

describe("Http", () => {
  it("matches snapshot", () => {
    const { asFragment } = render(
      <svg>
        <Http />
      </svg>
    );
    expect(asFragment()).toMatchSnapshot();
  });
});
