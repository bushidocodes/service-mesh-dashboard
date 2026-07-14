/* Faithful single-file port of react-sparklines: Sparklines +
   SparklinesLine + SparklinesReferenceLine are tightly coupled and
   intentionally co-located, as in the original. */
import React, { Children, cloneElement } from "react";

/**
 * Dependency-free port of the unmaintained `react-sparklines` package (last
 * published 2017). See issue #45.
 *
 * Only the three exports this app used are re-implemented — `Sparklines`,
 * `SparklinesLine` and `SparklinesReferenceLine` — with the same prop API and
 * SVG geometry as react-sparklines@1.7.0, so the rendered output is identical
 * and callers only had to change the import path to this module.
 */

interface SparklinesProps {
  children?: React.ReactNode;
  data?: number[];
  height?: number;
  limit?: number;
  margin?: number;
  max?: number;
  min?: number;
  preserveAspectRatio?: string;
  style?: Record<string, unknown>;
  svgHeight?: number;
  svgWidth?: number;
  width?: number;
}

interface Point {
  x: number;
  y: number;
}

// Props Sparklines injects into each child (SparklinesLine / ReferenceLine) via
// cloneElement. Declared so the cloneElement cast accepts them under React 19's
// stricter element-props typing.
interface InjectedChildProps {
  data?: number[];
  points?: Point[];
  width?: number;
  height?: number;
  margin?: number;
}

const noopMouseMove = (..._args: any[]) => {};

interface SparklinesLineProps {
  color?: string;
  data?: number[];
  height?: number;
  margin?: number;
  onMouseMove?: (...args: any[]) => any;
  points?: Point[];
  style?: React.CSSProperties;
}

interface SparklinesReferenceLineProps {
  margin?: number;
  points?: Point[];
  style?: React.CSSProperties;
  type?: "max" | "min" | "mean" | "avg" | "median" | "custom";
  value?: number;
}

// Map raw values into {x, y} coordinates inside a `0 0 width height` viewBox.
// Larger values sit nearer the top (smaller y), matching SVG's y-down axis.
// Geometry is a faithful copy of react-sparklines' dataProcessing/dataToPoints
// — including the `max === min` branch, which centres a flat line vertically
// rather than pinning it to the top margin.
const dataToPoints = ({
  data,
  limit,
  width = 1,
  height = 5,
  margin = 0,
  max = Math.max(...data),
  min = Math.min(...data)
}: {
  data: number[];
  limit?: number;
  width?: number;
  height?: number;
  margin?: number;
  max?: number;
  min?: number;
}) => {
  const len = data.length;
  const vfactor = (height - margin * 2) / (max - min || 2);
  const hfactor =
    (width - margin * 2) / ((limit || len) - (len > 1 ? 1 : 0) || 1);
  return data.map((d: number, i: number) => ({
    x: i * hfactor + margin,
    y: (max === min ? (height - margin * 2) / 2 : (max - d) * vfactor) + margin
  }));
};

export function Sparklines({
  data = [],
  limit,
  width = 240,
  height = 60,
  svgWidth,
  svgHeight,
  preserveAspectRatio = "none",
  margin = 2,
  style,
  min,
  max,
  children
}: SparklinesProps) {
  if (data.length === 0) return null;

  const points = dataToPoints({ data, limit, width, height, margin, max, min });

  const svgOpts: React.SVGProps<SVGSVGElement> = {
    style,
    viewBox: `0 0 ${width} ${height}`,
    preserveAspectRatio
  };
  if (svgWidth != null && svgWidth > 0) svgOpts.width = svgWidth;
  if (svgHeight != null && svgHeight > 0) svgOpts.height = svgHeight;

  // Decorative chart mark; series values are conveyed by surrounding UI.
  return (
    <svg {...svgOpts} aria-hidden={true} focusable="false">
      {Children.map(children, (child) =>
        child
          ? // React 19's @types/react defaults ReactElement props to `unknown`, so
            // type the cast with the props Sparklines injects into its children.
            cloneElement(child as React.ReactElement<InjectedChildProps>, {
              data,
              points,
              width,
              height,
              margin
            })
          : child
      )}
    </svg>
  );
}

export function SparklinesLine({
  data = [],
  points = [],
  height = 60,
  margin = 2,
  color,
  style = {},
  onMouseMove = noopMouseMove
}: SparklinesLineProps) {
  const linePoints = points
    .map((p) => [p.x, p.y])
    .reduce((a, b) => a.concat(b));

  // Close the area polygon: drop to the baseline under the last point, run
  // along the baseline to the left margin, then back up to the first point.
  const firstPoint = points[0];
  const lastPoint = points[points.length - 1];
  const closePolyPoints =
    firstPoint && lastPoint
      ? [
          lastPoint.x,
          height - margin,
          margin,
          height - margin,
          margin,
          firstPoint.y
        ]
      : [];
  const fillPoints = linePoints.concat(closePolyPoints);

  const lineStyle = {
    stroke: color || style.stroke || "slategray",
    strokeWidth: style.strokeWidth || "1",
    strokeLinejoin: style.strokeLinejoin || "round",
    strokeLinecap: style.strokeLinecap || "round",
    fill: "none"
  };
  const fillStyle: React.CSSProperties = {
    stroke: style.stroke || "none",
    strokeWidth: "0",
    fillOpacity: style.fillOpacity || ".1",
    fill: style.fill || color || "slategray",
    pointerEvents: "auto"
  };

  // Invisible hover targets at each data point (react-sparklines' tooltip
  // spots). Handlers attach only when a real onMouseMove is supplied so
  // decorative charts do not advertise static-element interactivity.
  const interactive = onMouseMove !== noopMouseMove;
  const spots = points.map((p, i) => (
    <circle
      key={i}
      cx={p.x}
      cy={p.y}
      r={2}
      style={fillStyle}
      {...(interactive
        ? {
            onMouseEnter: () => onMouseMove("enter", data[i], p),
            onClick: () => onMouseMove("click", data[i], p)
          }
        : {})}
    />
  ));

  return (
    <g>
      {spots}
      <polyline points={fillPoints.join(" ")} style={fillStyle} />
      <polyline points={linePoints.join(" ")} style={lineStyle} />
    </g>
  );
}

// Reference-line y is computed from the (already margin-offset) point y-values,
// matching react-sparklines, which then offsets by `margin` again.
const referenceValue: Record<string, (ys: number[]) => number> = {
  max: (ys: number[]) => Math.max(...ys),
  min: (ys: number[]) => Math.min(...ys),
  mean: (ys: number[]) =>
    ys.reduce((a: number, b: number) => a + b, 0) / ys.length,
  avg: (ys: number[]) =>
    ys.reduce((a: number, b: number) => a + b, 0) / ys.length,
  median: (ys: number[]) => {
    const sorted = [...ys].sort((a, b) => a - b);
    const mid = Math.floor(sorted.length / 2);
    if (sorted.length % 2 === 0) {
      const left = sorted[mid - 1] ?? 0;
      const right = sorted[mid] ?? 0;
      return (left + right) / 2;
    }
    return sorted[mid] ?? 0;
  }
};

function computeReferenceY(
  type: string,
  ys: number[],
  customValue?: number
): number {
  if (type === "custom") return customValue ?? 0;
  const compute = referenceValue[type] ?? referenceValue.mean;
  // mean always exists on the map; fall back to 0 only if empty/absent.
  return compute ? compute(ys) : 0;
}

export function SparklinesReferenceLine({
  points = [],
  margin = 2,
  type = "mean",
  value,
  style = { stroke: "red", strokeOpacity: 0.75, strokeDasharray: "2, 2" }
}: SparklinesReferenceLineProps) {
  const ypoints = points.map((p) => p.y);
  const y = computeReferenceY(type, ypoints, value);
  const firstPoint = points[0];
  const lastPoint = points[points.length - 1];
  if (!firstPoint || !lastPoint) return null;

  return (
    <line
      x1={firstPoint.x}
      y1={y + margin}
      x2={lastPoint.x}
      y2={y + margin}
      style={style}
    />
  );
}
