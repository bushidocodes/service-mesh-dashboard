import React from "react";
import PropTypes from "prop-types";
import TooltipContent from "./components/TooltipContent";
import TooltipWrap from "./components/TooltipWrap";

export default function Tooltip({
  children,
  content,
  position = "bottom",
  disabled,
  contentStyle = {},
  containerStyle = {}
}) {
  return (
    <TooltipWrap style={containerStyle} disabled={disabled}>
      {children}
      <TooltipContent style={contentStyle} position={position}>
        {content}
      </TooltipContent>
    </TooltipWrap>
  );
}

Tooltip.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.element,
    PropTypes.node,
    PropTypes.string,
    PropTypes.number
  ]).isRequired,
  containerStyle: PropTypes.object,
  content: PropTypes.string,
  contentStyle: PropTypes.object,
  disabled: PropTypes.bool,
  position: PropTypes.oneOf(["top", "bottom", "left", "right"])
};
