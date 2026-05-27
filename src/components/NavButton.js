import { PropTypes } from "prop-types";
import React from "react";
import { NavLink } from "react-router-dom";

import Icon from "components/Icon";
import Glyph from "components/Glyphs/";

import ButtonWrap from "./Button/components/ButtonWrap";
import ButtonPrefix from "./Button/components/ButtonLabelPrefix.js";
import ButtonSuffix from "./Button/components/ButtonLabelSuffix.js";

NavButton.propTypes = {
  active: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]),
  hideLabel: PropTypes.bool, // boolean that toggles if the label should be shown as text after the icon
  icon: PropTypes.string, // string of UIKit Icon to use for button
  iconSize: PropTypes.oneOf(["normal", "xs", "sm", "lg", "xl"]), // Relative size of the icon
  label: PropTypes.string.isRequired, // label for the button
  labelStyle: PropTypes.object,
  orientation: PropTypes.oneOf(["vertical", "horizontal"]), // Vertical: Icon top, label bottom; Horizontal: Icon left, label right;
  outline: PropTypes.oneOf([
    "raised", // Add highlight effect to top edge and shadow effect to bottom edge
    "outline", // Add outline effect
    "shadow", // Add shadow effect to bottom edge
    "none" // No effects
  ]),
  prefix: PropTypes.oneOfType([PropTypes.string, PropTypes.number]), // Add prefix text to button label
  size: PropTypes.oneOf(["normal", "xs", "sm", "lg", "xl"]), // Relative size of the button
  suffix: PropTypes.oneOfType([PropTypes.string, PropTypes.number]), // Add suffix text to button label
  tabIndex: PropTypes.number,
  to: PropTypes.string.isRequired, // route the button should navigate to
  type: PropTypes.oneOf(["danger", "info", "primary", "secondary", "warning"])
};
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
}) {
  return (
    <NavLink tabIndex={tabIndex} title={label} to={to}>
      <ButtonWrap
        active={active}
        type={type}
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
