import { errorColor } from "style/styleFunctions";
import styled from "styled-components";

interface TableColProps {
  errorPercent?: string | number;
}

const TableCol = styled.div<TableColProps>`
  ${(props) =>
    props.errorPercent ? `color: ${errorColor(props.errorPercent)}` : ""};
  flex: 1 1 12%;
  text-align: left;
`;

export default TableCol;
