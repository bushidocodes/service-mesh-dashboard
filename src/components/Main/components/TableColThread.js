import styled from "styled-components";

import TableCol from "./TableCol";
import PropTypes from "prop-types";

const TableColThread = styled(TableCol)`
  flex: 0 1 5em;
  ${(props) =>
    props.right
      ? `
      flex: 0 1 7em;
      justify-content: flex-end; 
      text-align: right; 
      `
      : `
      justify-content: center;
      text-align: center; 
      `};
`;

TableColThread.propTypes = {
  right: PropTypes.bool
};

export default TableColThread;
