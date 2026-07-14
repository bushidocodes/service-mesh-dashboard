import Icon from "components/Icon/index";
import React from "react";
import ReadoutItemIconStyle from "./components/ReadoutItemIconStyle";

interface ReadoutItemIconProps {
  children?: React.ReactNode;
  iconBackgroundStyle?: string;
  iconBorderStyle?: string;
  iconBorderWidth?: number | string;
}

/**
 * ReadoutItemIcon wrapper that renders an Icon with Glyph component passed in as props.children
 * @function ReadoutItemIcon
 * @param {children }
 * @returns JSX.Element
 */
export default function ReadoutItemIcon({
  children,
  iconBorderStyle,
  iconBorderWidth = "1"
}: ReadoutItemIconProps) {
  return (
    <ReadoutItemIconStyle>
      <Icon
        iconRatio="2"
        borderStyle={iconBorderStyle}
        borderWidth={iconBorderWidth}
        backgroundOpacity=".2"
      >
        {children}
      </Icon>
    </ReadoutItemIconStyle>
  );
}
