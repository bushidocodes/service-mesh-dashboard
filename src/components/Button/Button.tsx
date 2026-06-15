import React from "react";
import Icon from "components/Icon";
import Glyph from "components/Glyphs/";

import ButtonWrap from "./components/ButtonWrap";
import ButtonLabelPrefix from "./components/ButtonLabelPrefix";
import ButtonLabelSuffix from "./components/ButtonLabelSuffix";

interface ButtonProps {
  active?: boolean; // If the button should be style as active or not
  children?: React.ReactNode;
  clickAction: any; // click handler
  disabled?: boolean; // disables the button
  glyph?: string; // Glyph to display in the button
  glyphColor?: string; // Color for the glyph
  glyphRatio?: string | number; // Relative size for the glyph
  iconSize?: string;
  label: string; // label for the button
  labelStyle?: Record<string, unknown>;
  orientation?: "vertical" | "horizontal"; // Vertical: Icon top, label bottom; Horizontal: Icon left, label right;
  outline?: "raised" | "outline" | "shadow" | "none" | "raised-outline";
  prefix?: string | number; // Add prefix text to button label
  size?: "normal" | "xs" | "sm" | "lg" | "xl"; // Relative size of the button
  style?: Record<string, unknown>; // style prop
  suffix?: string | number; // Add suffix text to button label
  tabIndex?: number;
  type?: "danger" | "info" | "primary" | "secondary" | "warning" | "polling";
}

/**
 * General purpose button
 * @param {Object} props - see propTypes
 * @returns JSX.Element
 */
function Button({
  active,
  children,
  clickAction,
  disabled,
  glyph,
  glyphRatio,
  glyphColor,
  label,
  orientation,
  prefix,
  size,
  style,
  suffix,
  outline,
  tabIndex,
  type,
  iconSize,
  labelStyle
}: ButtonProps) {
  return (
    <ButtonWrap
      active={active}
      type={type}
      size={size}
      outline={outline}
      orientation={orientation}
      disabled={disabled}
      onClick={clickAction}
      tabIndex={tabIndex}
      title={label}
      style={style}
      iconSize={iconSize}
    >
      {glyph && (
        <Icon>
          <Glyph glyphColor={glyphColor} name={glyph} ratio={glyphRatio} />
        </Icon>
      )}
      {children}
      <span style={labelStyle}>
        {prefix ? <ButtonLabelPrefix>{prefix}</ButtonLabelPrefix> : ""}
        {label}
        {suffix ? <ButtonLabelSuffix>{suffix}</ButtonLabelSuffix> : ""}
      </span>
    </ButtonWrap>
  );
}

export default Button;
