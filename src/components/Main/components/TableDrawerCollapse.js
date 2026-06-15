import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";

import { COLOR_CONTENT_BACKGROUND } from "style/styleVariables";
import { spacingScale, contrastColor } from "style/styleFunctions";

// CSS Grid trick: animate grid-template-rows from 0fr → 1fr for a smooth
// height transition without knowing the content height in advance. The inner
// div must have overflow:hidden to make 0fr actually clip to zero height.
const DrawerOuter = styled.div`
  cursor: default;
  flex: 0 0 100%;
  display: grid;
  grid-template-rows: 0fr;
  overflow: hidden;
  transition: grid-template-rows 0.3s ease;
  white-space: normal;

  &[aria-hidden="false"] {
    grid-template-rows: 1fr;
  }
`;

const DrawerInner = styled.div`
  overflow: hidden;

  > div:first-child {
    box-shadow: inset 0 1px
      ${contrastColor(COLOR_CONTENT_BACKGROUND, 0.02).string()};
    box-sizing: border-box;
    cursor: default;
    height: auto;
    margin: 0 ${spacingScale(2)};
    padding: ${spacingScale(2)} 0;
    text-align: left;
    white-space: normal;
  }
`;

// Replaces react-collapse's UnmountClosed. Renders nothing until first opened
// so that chart children (e.g. Dygraph) are not mounted before visible. Once
// mounted the wrapper stays in the DOM so the chart is not destroyed on close.
function TableDrawerCollapse({ isOpened, children, onClick }) {
  const [mounted, setMounted] = useState(isOpened);

  useEffect(() => {
    if (isOpened) setMounted(true);
  }, [isOpened]);

  if (!mounted) return null;

  return (
    <DrawerOuter
      aria-hidden={!isOpened}
      className="drawer-collapse"
      onClick={onClick}
    >
      <DrawerInner>{children}</DrawerInner>
    </DrawerOuter>
  );
}

TableDrawerCollapse.propTypes = {
  children: PropTypes.node,
  isOpened: PropTypes.bool,
  onClick: PropTypes.func
};

export default TableDrawerCollapse;
