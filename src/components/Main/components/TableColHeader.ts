import { rowChildSpacing } from "style/styleFunctions";
import styled from "styled-components";
import TableCol from "./TableCol";

const TableColHeader = styled(TableCol)`
  ${rowChildSpacing()};
`;
export default TableColHeader;
