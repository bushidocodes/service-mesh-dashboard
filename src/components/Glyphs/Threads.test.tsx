import { render } from "@testing-library/react";
import Threads from "./Threads";

describe("Threads", () => {
  it("matches snapshot", () => {
    const { asFragment } = render(
      <svg>
        <Threads />
      </svg>
    );
    expect(asFragment()).toMatchSnapshot();
  });
});
