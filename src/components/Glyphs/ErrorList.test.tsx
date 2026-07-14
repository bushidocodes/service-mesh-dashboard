import { render } from "@testing-library/react";
import React from "react";
import ErrorList from "./ErrorList";

describe("ErrorList", () => {
  it("matches snapshot", () => {
    const { asFragment } = render(
      <svg>
        <ErrorList />
      </svg>
    );
    expect(asFragment()).toMatchSnapshot();
  });
});
