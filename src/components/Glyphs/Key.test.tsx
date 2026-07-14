import { render } from "@testing-library/react";
import Key from "./Key";

describe("Key", () => {
  it("matches snapshot", () => {
    const { asFragment } = render(
      <svg>
        <Key />
      </svg>
    );
    expect(asFragment()).toMatchSnapshot();
  });
});
