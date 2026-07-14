import { render } from "@testing-library/react";
import Instances from "./Instances";

describe("Instances", () => {
  it("matches snapshot", () => {
    const { asFragment } = render(
      <svg>
        <Instances />
      </svg>
    );
    expect(asFragment()).toMatchSnapshot();
  });
});
