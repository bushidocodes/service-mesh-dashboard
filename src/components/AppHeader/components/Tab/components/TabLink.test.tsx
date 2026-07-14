import { render } from "@testing-library/react";
import React from "react";
import { MemoryRouter } from "react-router-dom";
import TabLink from "./TabLink";

describe("TabLink", () => {
  it("matches snapshot", () => {
    const { asFragment } = render(
      <MemoryRouter>
        <TabLink to="/" />
      </MemoryRouter>
    );
    expect(asFragment()).toMatchSnapshot();
  });
});
