import React from "react";
import { render } from "@testing-library/react";
import ConfirmationQuery from "./ConfirmationQuery";

describe("ConfirmationQuery", () => {
  it("matches snapshot", () => {
    const { asFragment } = render(<ConfirmationQuery />);
    expect(asFragment()).toMatchSnapshot();
  });
});
