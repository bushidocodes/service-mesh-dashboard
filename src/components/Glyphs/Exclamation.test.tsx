import { render } from "@testing-library/react";
import Exclamation from "./Exclamation";

describe("Exclamation", () => {
  it("matches snapshot", () => {
    const { asFragment } = render(
      <svg>
        <Exclamation />
      </svg>
    );
    expect(asFragment()).toMatchSnapshot();
  });
});
