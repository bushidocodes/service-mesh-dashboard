import { render, screen } from "@testing-library/react";

import Tooltip from "./Tooltip";

// Position rules are prop-driven CSS. Assert the computed style rather than
// snapshotting styled-components class hashes, which include the library version.
const positions = [
  ["top", { bottom: "150%", left: "50%", marginLeft: "-80px" }],
  ["bottom", { top: "150%", left: "50%", marginLeft: "-80px" }],
  ["left", { right: "120%", top: "-5px" }],
  ["right", { top: "-5px", left: "120%" }]
] as const;

function renderTooltip(position: (typeof positions)[number][0]) {
  return render(
    <Tooltip content="Hello!" position={position}>
      Hover over me
    </Tooltip>
  );
}

describe("Tooltip", () => {
  it.each(positions)("positions tooltip content %s", (position, style) => {
    renderTooltip(position);
    expect(screen.getByText("Hello!")).toHaveStyle(style);
  });

  it("renders a tooltip div with the correct content", () => {
    const { container } = renderTooltip("bottom");
    expect(container).toHaveTextContent("Hello!");
  });
});
