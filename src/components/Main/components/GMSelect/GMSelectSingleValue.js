import React from "react";
import PropTypes from "prop-types";
import { components } from "react-select";

export default function GMSelectSingleValue({ data, selectProps, ...svProps }) {
  return (
    <components.SingleValue {...svProps}>
      {selectProps.valueRenderer(data)}
    </components.SingleValue>
  );
}

GMSelectSingleValue.propTypes = {
  data: PropTypes.object.isRequired,
  selectProps: PropTypes.shape({
    valueRenderer: PropTypes.func.isRequired
  }).isRequired
};
