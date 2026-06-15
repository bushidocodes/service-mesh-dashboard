import React from "react";
import TooltipContent from "./components/TooltipContent";
import TooltipWrap from "./components/TooltipWrap";

interface TooltipProps {
  children: React.ReactElement | React.ReactNode | string | number;
  containerStyle?: Record<string, unknown>;
  content?: string;
  contentStyle?: Record<string, unknown>;
  disabled?: boolean;
  position?: "top" | "bottom" | "left" | "right";
}

export default function Tooltip({
  children,
  content,
  position = "bottom",
  disabled,
  contentStyle = {},
  containerStyle = {}
}: TooltipProps) {
  return (
    <TooltipWrap style={containerStyle} disabled={disabled}>
      {children}
      <TooltipContent style={contentStyle} position={position}>
        {content}
      </TooltipContent>
    </TooltipWrap>
  );
}
