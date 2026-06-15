import React from "react";
import { NavLink } from "react-router-dom";

import Icon from "components/Icon";
import Glyph from "components/Glyphs/";

import ButtonWrap from "./Button/components/ButtonWrap";
import ButtonPrefix from "./Button/components/ButtonLabelPrefix";
import ButtonSuffix from "./Button/components/ButtonLabelSuffix";

interface NavButtonProps {
  active?: boolean;
  hideLabel?: boolean; // boolean that toggles if the label should be shown as text after the icon
  icon?: string; // string of UIKit Icon to use for button
  iconSize?: "normal" | "xs" | "sm" | "lg" | "xl"; // Relative size of the icon
  label: string; // label for the button
  labelStyle?: React.CSSProperties;
  orientation?: "vertical" | "horizontal"; // Vertical: Icon top, label bottom; Horizontal: Icon left, label right;
  outline?: "raised" | "outline" | "shadow" | "none";
  prefix?: string | number; // Add prefix text to button label
  size?: "normal" | "xs" | "sm" | "lg" | "xl"; // Relative size of the button
  suffix?: string | number; // Add suffix text to button label
  tabIndex?: number;
  to: string; // route the button should navigate to
  type?: "danger" | "info" | "primary" | "secondary" | "warning";
}

/**
 * General purpose button used for client-side navigation anywhere outside of sidebar
 * @param {Object} props - refer to propTypes
 * */
function NavButton({
  active,
  hideLabel,
  icon,
  iconSize,
  label,
  orientation,
  prefix,
  size,
  suffix,
  outline,
  tabIndex,
  type,
  to,
  labelStyle
}: NavButtonProps) {
  return (
    <NavLink tabIndex={tabIndex} title={label} to={to}>
      <ButtonWrap
        active={active}
        type={type as any}
        iconSize={iconSize}
        size={size}
        outline={outline}
        orientation={orientation}
      >
        {icon && (
          <Icon className="icon">
            <Glyph name={icon} />
          </Icon>
        )}
        {!hideLabel && (
          <span style={labelStyle}>
            {prefix ? <ButtonPrefix>{prefix}</ButtonPrefix> : ""}
            {label}
            {suffix ? <ButtonSuffix>{suffix}</ButtonSuffix> : ""}
          </span>
        )}
      </ButtonWrap>
    </NavLink>
  );
}

export default NavButton;
