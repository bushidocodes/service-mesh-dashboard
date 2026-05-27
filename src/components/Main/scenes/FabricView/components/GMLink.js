import React from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { PropTypes } from "prop-types";

import { COLOR_HIGHLIGHT, COLOR_CONTENT_MUTED } from "style/styleVariables";

// Wrap Link in a plain function component so styled-components v2 can wrap it.
// React Router v6 exports Link as a forwardRef object (typeof === "object").
function LinkWrapper(props) {
  return <Link {...props} />;
}

const GMLink = styled(LinkWrapper)`
  width: 100%;
  cursor: ${(props) => (props.cursor ? props.cursor : "pointer")};
  text-decoration: none;
  color: black;
  display: flex;

  &:focus {
    outline: -webkit-focus-ring-color auto 5px;
  }

  &:hover {
    ${(props) =>
      props.disabled
        ? `
        color: ${COLOR_CONTENT_MUTED.string()};
        cursor: not-allowed;
    `
        : `
        color: ${COLOR_HIGHLIGHT.string()};
    `};
  }

  &:focus:active:hover {
    outline: 0;
  }

  ${(props) =>
    props.disabled &&
    `
      color: ${COLOR_CONTENT_MUTED.string()};
      cursor: not-allowed;

  `};
`;

GMLink.propTypes = {
  disabled: PropTypes.bool
};

export default GMLink;
