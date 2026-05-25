import styled from "styled-components";
import { PropTypes } from "prop-types";

import { hide } from "components/globalPatterns";

const Breadcrumbs = styled.ol`
  align-items: stretch;
  display: flex;
  flex: 1 1 auto;
  flex-direction: row;
  height: inherit;
  margin: 0;
  padding: 0;

  > li:first-child {
    ${(props) => (props.hideRoot ? hide : "")};
  }
`;

Breadcrumbs.propTypes = {
  hideRoot: PropTypes.bool
};

export default Breadcrumbs;
