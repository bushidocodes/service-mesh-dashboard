import React from "react";

interface BackgroundSquareRoundedProps {
  backgroundColor?: string;
  backgroundOpacity?: string | number;
  ratio?: string | number;
}

const title = "SquareRounded";

function BackgroundSquareRounded({
  ratio = 1,
  backgroundColor = "currentColor",
  backgroundOpacity = "1"
}: BackgroundSquareRoundedProps) {
  return (
    <g
      id={title}
      className="iconBackground"
      fillOpacity={backgroundOpacity}
      fill={backgroundColor}
      fillRule="evenodd"
    >
      <rect id="Rectangle" x="0" y="0" width="24" height="24" rx="4" />
    </g>
  );
}

export default BackgroundSquareRounded;
