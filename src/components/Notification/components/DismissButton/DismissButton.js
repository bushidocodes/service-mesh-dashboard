import React from "react";
import PropTypes from "prop-types";

import Icon from "components/Icon";
import Close from "components/Glyphs/Close";

import DismissButtonContainer from "./components/DismissButtonContainer";

DismissButton.propTypes = {
  // react-toastify passes `closeToast` into the toast content; we forward it
  // here so clicking the dismiss glyph closes the toast.
  onClick: PropTypes.func
};

function DismissButton({ onClick }) {
  return (
    <DismissButtonContainer onClick={onClick}>
      <Icon>
        <Close />
      </Icon>
    </DismissButtonContainer>
  );
}

export default DismissButton;
