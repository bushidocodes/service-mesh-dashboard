import TableCol from "./TableCol";

import { rowChildSpacing } from "style/styleFunctions";

const TableColHeader = TableCol.extend`
  ${rowChildSpacing()};
`;
export default TableColHeader;
