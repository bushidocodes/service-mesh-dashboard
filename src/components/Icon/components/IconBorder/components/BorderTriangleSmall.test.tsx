import { render } from "@testing-library/react";
import BorderTriangleSmall from "./BorderTriangleSmall";

describe("BorderTriangleSmall", () => {
  it("matches snapshot", () => {
    const { asFragment } = render(
      <svg>
        <BorderTriangleSmall />
      </svg>
    );
    expect(asFragment()).toMatchSnapshot();
  });
});
