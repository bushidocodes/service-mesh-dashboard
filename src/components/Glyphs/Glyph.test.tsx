import { render } from "@testing-library/react";

import Glyph, { GLYPH_NAMES } from "./Glyph";

/**
 * Glyphs are pure presentational SVG fragments. Prefer a registry smoke test
 * over one snapshot per glyph (formerly 53 snaps, high churn / low signal).
 * Prop wiring for the Glyph wrapper lives in the behavioral tests below.
 */
describe("Glyph registry", () => {
  it("registers a stable non-empty set of glyphs", () => {
    expect(GLYPH_NAMES.length).toBeGreaterThan(40);
  });

  it.each(
    GLYPH_NAMES
  )("renders registered glyph %s without an empty fallback", (name) => {
    const { container } = render(
      <svg>
        <Glyph name={name} />
      </svg>
    );
    const glyph = container.querySelector("g.glyph");
    expect(glyph).toBeInTheDocument();
    // Unknown names fall back to an empty <g />; registered ones mount children.
    expect(glyph!.children.length).toBeGreaterThan(0);
  });
});

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
