import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { UnmountClosed } from "react-collapse";

import { COLOR_CONTENT_BACKGROUND } from "style/styleVariables";
import { spacingScale, contrastColor } from "style/styleFunctions";

// react-collapse v5 uses a `theme` prop (not `className`) for its root element's
// CSS class. styled-components injects styles via `className`, which react-collapse
// silently ignores. This adapter forwards the injected className into theme.collapse
// so the generated CSS actually reaches the DOM element.
//
// UnmountClosed is used instead of Collapse so that chart children (e.g. Dygraph)
// are only mounted when the drawer is open — this avoids rendering cost and
// prevents Dygraph from processing data before the canvas is visible.
function CollapseBridge({ className, isOpened, children, ...rest }) {
  return (
    <UnmountClosed
      isOpened={isOpened}
      theme={{
        collapse: `ReactCollapse--collapse${className ? ` ${className}` : ""}`,
        content: "ReactCollapse--content"
      }}
      {...rest}
    >
      {children}
    </UnmountClosed>
  );
}

CollapseBridge.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  isOpened: PropTypes.bool
};

const TableDrawerCollapse = styled(CollapseBridge)`
  cursor: default;
  flex: 0 0 100%;
  min-height: 0;
  overflow: hidden;
  padding: 0;
  white-space: normal;
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

export default TableDrawerCollapse;
