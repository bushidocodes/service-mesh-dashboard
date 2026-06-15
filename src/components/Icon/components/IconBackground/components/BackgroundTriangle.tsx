import React from "react";

interface BackgroundTriangleProps {
  backgroundColor?: string;
  backgroundOpacity?: string | number;
  ratio?: string | number;
}

const title = "Square";

function BackgroundTriangle({
  ratio = 1,
  backgroundColor = "transparent",
  backgroundOpacity = "1"
}: BackgroundTriangleProps) {
  return (
    <g
      id={title}
      className="iconBackground"
      fillOpacity={backgroundOpacity}
      fill={backgroundColor}
      fillRule="evenodd"
    >
      <polygon id="Triangle-6" points="12 1 24 20 0 20" />
    </g>
  );
}

export default BackgroundTriangle;
