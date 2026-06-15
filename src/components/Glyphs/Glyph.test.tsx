import React from "react";
import { render } from "@testing-library/react";

import Glyph from "./index";

describe("Glyph", () => {
  let container: HTMLElement;

  beforeEach(() => {
    // SVG-fragment component: root is a <g>, so wrap in <svg> to avoid
    // "<g> is unrecognized in this browser" warnings.
    ({ container } = render(
      <svg>
        <Glyph glyphColor="#f55900" name="Bell" ratio={1} />
      </svg>
    ));
  });

  test("returns a Glyph corresponding to the name prop", () => {
    // Bell renders <path id="Shape" .../>; its presence proves the Bell
    // glyph was selected for name="Bell".
    expect(container.querySelector("g.glyph path#Shape")).toBeInTheDocument();
  });

  test("returns a Glyph with a fill corresponding to the glyphColor prop", () => {
    expect(container.querySelector("g.glyph")).toHaveAttribute(
      "fill",
      "#f55900"
    );
  });

  test("returns a Glyph with a scale corresponding to the ratio prop", () => {
    expect(container.querySelector("g.glyph")).toHaveAttribute(
      "transform",
      expect.stringContaining("scale(1)")
    );
  });

  test("returns an empty <g> if a glyph name is not found", () => {
    ({ container } = render(
      <svg>
        <Glyph name="Belt" />
      </svg>
    ));
    const g = container.querySelector("g");
    // Empty fallback <g /> has no child glyph and none of the styling attrs.
    expect(g).toBeInTheDocument();
    expect(g!.children).toHaveLength(0);
    expect(g).not.toHaveAttribute("class");
    expect(g).not.toHaveAttribute("fill");
    expect(g).not.toHaveAttribute("transform");
  });
});
