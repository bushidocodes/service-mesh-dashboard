import { render } from "@testing-library/react";
import React from "react";
import ConfirmationQuery from "./ConfirmationQuery";

describe("ConfirmationQuery", () => {
  it("matches snapshot", () => {
    const { asFragment } = render(<ConfirmationQuery />);
    expect(asFragment()).toMatchSnapshot();
  });
});
