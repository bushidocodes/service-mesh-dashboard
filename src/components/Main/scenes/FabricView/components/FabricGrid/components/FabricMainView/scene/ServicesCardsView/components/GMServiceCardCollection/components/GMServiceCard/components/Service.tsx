import React from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";

// Wrap Link in a plain function component so styled-components v2 can wrap it.
// React Router v6 exports Link as a forwardRef object (typeof === "object").
function LinkWrapper(props) {
  return <Link {...props} />;
}

export const ServiceLink = styled(LinkWrapper)<{
  cardBackgroundColor?: string;
  cardHighlightColor?: string;
  cursor?: string;
  disabled?: boolean | null;
}>`
  &,
  &:hover,
  &:active,
  &:focus {
    text-decoration: none;
    color: inherit;
    cursor: not-allowed;

    &:after {
      content: "";
      position: absolute;
      top: 0;
      bottom: 0;
      right: 0;
      left: 0;
      z-index: 1;
    }
  }

  &:not([disabled]) {
    cursor: pointer;
  }
`;
