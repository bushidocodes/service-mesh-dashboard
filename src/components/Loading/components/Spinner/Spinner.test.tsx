import { render } from "@testing-library/react";
import React from "react";
import Spinner from "./Spinner";

describe("Spinner", () => {
  it("matches snapshot", () => {
    const { asFragment } = render(<Spinner />);
    expect(asFragment()).toMatchSnapshot();
  });
});
