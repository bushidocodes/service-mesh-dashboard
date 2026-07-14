import { render } from "@testing-library/react";
import GRPC from "./GRPC";

describe("GRPC", () => {
  it("matches snapshot", () => {
    const { asFragment } = render(
      <svg>
        <GRPC />
      </svg>
    );
    expect(asFragment()).toMatchSnapshot();
  });
});
