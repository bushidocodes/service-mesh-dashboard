import { render } from "@testing-library/react";
import React from "react";
import AppVersionLink from "./AppVersionLink";

describe("AppVersionLink", () => {
  it("matches snapshot", () => {
    const { asFragment } = render(<AppVersionLink />);
    expect(asFragment()).toMatchSnapshot();
  });
});
