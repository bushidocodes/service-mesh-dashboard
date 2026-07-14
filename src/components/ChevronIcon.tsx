interface ChevronIconProps {
  ariaLabelledby?: string;
  direction?: string;
  fill?: string;
  height?: number;
  stroke?: string;
  strokeWidth?: number;
  title?: string;
  viewBox?: string;
  width?: number;
}

/**
 * ChevronIcon takes direction and svg parameters and returns svg element
 *
 * @param {any} {
 *   direction = "down",
 *   width = 26,
 *   height = 26,
 *   viewBox = "0 0 26 26",
 *   stroke = "black",
 *   strokeWidth = 1,
 *   fill = "none",
 *   ariaLabelledby = "chevron icon",
 *   title = "chevron icon"
 * }
 * @returns svg element
 */
function ChevronIcon({
  direction = "down",
  width = 26,
  height = 26,
  viewBox = "0 0 26 26",
  stroke = "black",
  strokeWidth = 1,
  fill = "none",
  ariaLabelledby = "chevron icon",
  title = "chevron icon"
}: ChevronIconProps) {
  let points = "";
  switch (direction) {
    case "up":
      points = "8 16 13.0407259 11 18.1 16 18.1 16";
      break;
    case "left":
      points = "15 18.1 10 13.0407259 15 8";
      break;
    case "right":
      points = "10 8 15 13.0592741 10 18.1";
      break;
    case "down":
    default:
      points = "18.1 11 13.0407259 16 8 11";
      break;
  }

  return (
    <svg
      width={width}
      height={height}
      viewBox={viewBox}
      aria-labelledby={ariaLabelledby}
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
    >
      <title>{title}</title>
      <g
        id="Glyphs"
        stroke="none"
        strokeWidth={strokeWidth}
        fill={fill}
        fillRule="evenodd"
      >
        <g id="chevron-down" strokeWidth="2" stroke="#000">
          <polyline id="Arrow" points={points} />
        </g>
      </g>
    </svg>
  );
}

export default ChevronIcon;
