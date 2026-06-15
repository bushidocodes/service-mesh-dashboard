import styled from "styled-components";

import TableCol from "./TableCol";

import { rowChildSpacing } from "style/styleFunctions";

const TableColHeader = styled(TableCol)`
  ${rowChildSpacing()};
`;
export default TableColHeader;
