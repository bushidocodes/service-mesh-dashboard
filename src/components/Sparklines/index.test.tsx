import { render } from "@testing-library/react";

import { Sparklines, SparklinesLine, SparklinesReferenceLine } from "./index";

describe("Sparklines", () => {
  const data = [0, 25, 430, 1256];

  const renderChart = () =>
    render(
      <Sparklines data={data} height={32} preserveAspectRatio="xMaxYMin">
        <SparklinesLine
          style={{ stroke: "currentColor", strokeWidth: 1, fill: "none" }}
        />
        <SparklinesReferenceLine
          style={{ stroke: "grey", opacity: "0.4" }}
          type="mean"
        />
      </Sparklines>
    );

  it("renders an svg with the given viewBox and preserveAspectRatio", () => {
    const { container } = renderChart();
    const svg = container.querySelector("svg");
    expect(svg).toBeInTheDocument();
    expect(svg).toHaveAttribute("viewBox", "0 0 240 32");
    expect(svg).toHaveAttribute("preserveAspectRatio", "xMaxYMin");
  });

  it("draws hover spots, fill + stroke polylines and a reference line", () => {
    const { container } = renderChart();
    expect(container.querySelectorAll("circle")).toHaveLength(data.length);
    expect(container.querySelectorAll("polyline")).toHaveLength(2);
    expect(container.querySelectorAll("line")).toHaveLength(1);
  });

  it("places the stroke polyline through the scaled data points", () => {
    const { container } = renderChart();
    const stroke = container.querySelectorAll("polyline")[1];
    // The largest value maps to the top of the viewBox (y = margin = 2).
    expect(stroke.getAttribute("points")).toContain("238 2");
  });

  it("renders nothing when data is empty", () => {
    const { container } = render(
      <Sparklines data={[]}>
        <SparklinesLine />
      </Sparklines>
    );
    expect(container.querySelector("svg")).toBeNull();
  });
});
