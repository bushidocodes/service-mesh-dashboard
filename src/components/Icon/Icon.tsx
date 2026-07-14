import React from "react";

import IconBackground from "./components/IconBackground";
import IconBorder from "./components/IconBorder";
import StyledG from "./components/StyledG";
import StyledSVG from "./components/StyledSVG";

interface IconProps {
  ariaLabelledby?: string;
  backgroundColor?: string;
  className?: string;
  backgroundOpacity?: string | number;
  backgroundStyle?: string;
  borderColor?: string;
  borderOpacity?: string | number;
  borderStyle?: string;
  borderWidth?: string | number;
  children?: React.ReactNode;
  glyphColor?: string;
  glyphName?: string;
  glyphRatio?: string | number;
  iconRatio?: string | number;
  title?: string;
  transform?: string;
}

/**
 * Renders an Icon with Glyph component passed in as props.children with any additional styling props
 * @param {any} { optional styling props}
 * @returns JSX elements
 */
export default function Icon({
  ariaLabelledby = "ariaLabelledby",
  backgroundColor = "currentColor",
  backgroundOpacity = "1",
  backgroundStyle,
  borderColor = "currentColor",
  borderOpacity = "1",
  borderStyle,
  borderWidth = "1",
  children,
  glyphColor = "currentColor",
  glyphName = "",
  glyphRatio = 1,
  iconRatio = "1",
  title = "",
  transform: _transform
}: IconProps) {
  return (
    <StyledSVG
      aria-labelledby={ariaLabelledby}
      iconRatio={iconRatio}
      glyphColor={glyphColor}
      focusable="false"
    >
      {backgroundStyle && (
        <IconBackground
          name={backgroundStyle}
          backgroundColor={backgroundColor}
          backgroundOpacity={backgroundOpacity}
          ratio={iconRatio}
        />
      )}
      {borderStyle && (
        <IconBorder
          name={borderStyle}
          borderColor={borderColor}
          borderOpacity={borderOpacity}
          borderWidth={borderWidth}
          ratio={iconRatio}
        />
      )}
      <StyledG title={glyphName} ratio={glyphRatio}>
        <title>{title ? title : glyphName}</title>
        {children}
      </StyledG>
    </StyledSVG>
  );
}
