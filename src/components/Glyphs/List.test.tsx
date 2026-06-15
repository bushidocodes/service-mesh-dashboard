import React from "react";
import { render } from "@testing-library/react";
import List from "./List";

describe("List", () => {
  it("matches snapshot", () => {
    const { asFragment } = render(
      <svg>
        <List />
      </svg>
    );
    expect(asFragment()).toMatchSnapshot();
  });
});
