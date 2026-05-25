import styled from "styled-components";
import { PropTypes } from "prop-types";

import { COLOR_CONTENT_BACKGROUND } from "style/styleVariables";
import { spacingScale, edgeColor } from "style/styleFunctions";

const DataPair = styled.div`
  display: flex;
  flex-direction: row;
  ${(props) =>
    props.priority === "normal" || props.priority === "secondary"
      ? "font-size: 0.8em;"
      : ""};
  padding-right: 15%;
  padding-top: ${spacingScale(0.25)};
  padding-bottom: ${spacingScale(0.25)};
  position: relative;
  ${(props) => (props.priority === "primary" ? dataPairPrimary() : "")};
`;

DataPair.propTypes = {
  priority: PropTypes.oneOf(["primary", "secondary", "normal"])
};

const dataPairPrimary = () => {
  return `
    overflow: hidden;
    &:after {
      content: "";
      position: absolute;
      bottom: 0;
      left: 4em;
      right: 4em;
      border-top: 1px solid ${edgeColor(COLOR_CONTENT_BACKGROUND)};
      border-left: 8em solid transparent;
      border-right: 8em solid transparent;
    }
`;
};

export default DataPair;
