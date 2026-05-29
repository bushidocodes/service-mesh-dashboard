import React from "react";
import { render } from "@testing-library/react";
import Twitter from "./Twitter";

describe("Twitter", () => {
  it("matches snapshot", () => {
    // Glyphs return a bare SVG fragment (<path>) meant to live inside an <svg>;
    // wrap it so it renders in the SVG namespace (avoids React's "unrecognized
    // tag" warning that fires when SVG elements are mounted as HTML children).
    const { asFragment } = render(
      <svg>
        <Twitter />
      </svg>
    );
    expect(asFragment()).toMatchSnapshot();
  });
});
