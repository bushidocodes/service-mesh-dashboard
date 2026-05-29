import React from "react";
import Select, { components } from "react-select";

import {
  ZINDEX_DROPDOWN,
  FONT_WEIGHT_SEMIBOLD,
  FONT_STACK_BASE,
  FONT_SIZE_BASE
} from "style/styleVariables";

// react-select v5 uses a CSS-in-JS styles object instead of global CSS classes.
const selectStyles = {
  container: (base) => ({
    ...base,
    fontFamily: FONT_STACK_BASE,
    flexGrow: 1,
    fontSize: FONT_SIZE_BASE,
    fontWeight: FONT_WEIGHT_SEMIBOLD,
    height: "28px",
    maxWidth: "125px",
    position: "relative",
    width: "100%",
    zIndex: ZINDEX_DROPDOWN
  }),
  control: (base) => ({
    ...base,
    height: "28px",
    minHeight: "28px",
    cursor: "pointer"
  }),
  valueContainer: (base) => ({
    ...base,
    height: "28px",
    padding: "0 8px"
  }),
  input: (base) => ({
    ...base,
    margin: "0",
    padding: "0"
  }),
  singleValue: (base) => ({
    ...base,
    lineHeight: "28px"
  }),
  placeholder: (base) => ({
    ...base,
    lineHeight: "28px"
  }),
  dropdownIndicator: (base) => ({
    ...base,
    padding: "4px"
  }),
  clearIndicator: (base) => ({
    ...base,
    padding: "4px"
  })
};

/**
 * GMSelect: styled react-select v5 wrapper.
 *
 * Maintains backward-compatible prop names from react-select v1:
 *   clearable    → isClearable
 *   searchable   → isSearchable
 *   valueRenderer(option) → rendered as a custom SingleValue component
 *
 * Also accepts a plain string/number `value` and resolves it to the
 * matching option object (required by react-select v5).
 */
export default function GMSelect({
  value,
  options,
  // v1 compat aliases
  clearable,
  isClearable,
  searchable,
  isSearchable,
  valueRenderer,
  onChange,
  ...rest
}) {
  // react-select v5 requires the full option object as value; v1 allowed a
  // plain string matching the option's value field.
  const resolvedValue =
    typeof value === "string" || typeof value === "number"
      ? ((options || []).find((opt) => opt.value === value) ?? null)
      : (value ?? null);

  // Map the legacy valueRenderer prop to a custom SingleValue component.
  const customComponents = {};
  if (valueRenderer) {
    customComponents.SingleValue = ({ data, ...svProps }) => (
      <components.SingleValue {...svProps}>
        {valueRenderer(data)}
      </components.SingleValue>
    );
  }

  return (
    <Select
      classNamePrefix="gm-select"
      value={resolvedValue}
      options={options}
      isClearable={isClearable ?? clearable ?? false}
      isSearchable={isSearchable ?? searchable ?? true}
      onChange={onChange}
      styles={selectStyles}
      components={customComponents}
      {...rest}
    />
  );
}
