import { render } from "@testing-library/react";
import React from "react";
import ReadoutDisplay from "./ReadoutDisplay";

describe("ReadoutDisplay", () => {
  it("matches snapshot when primary is true", () => {
    const { asFragment } = render(<ReadoutDisplay primary={true} />);
    expect(asFragment()).toMatchSnapshot();
  });
  it("matches snapshot when primary is false", () => {
    const { asFragment } = render(<ReadoutDisplay primary={false} />);
    expect(asFragment()).toMatchSnapshot();
  });
});
