import styled from "styled-components";

import TableCol from "./TableCol";

const TableColThread = styled(TableCol)<{ right?: boolean }>`
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

export default TableColThread;
