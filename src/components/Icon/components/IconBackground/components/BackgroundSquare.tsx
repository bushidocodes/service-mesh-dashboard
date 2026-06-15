import React from "react";

interface BackgroundSquareProps {
  backgroundColor?: string;
  backgroundOpacity?: string | number;
  ratio?: string | number;
}

const title = "Square";

function BackgroundSquare({
  ratio = 1,
  backgroundColor = "currentColor",
  backgroundOpacity = "1"
}: BackgroundSquareProps) {
  return (
    <g
      id={title}
      className="iconBackground"
      fillOpacity={backgroundOpacity}
      fill={backgroundColor}
      fillRule="evenodd"
    >
      <polygon id="Rect" points="24 0, 24 24, 0 24, 0 0" />
    </g>
  );
}

export default BackgroundSquare;
