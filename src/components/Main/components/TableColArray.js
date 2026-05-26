import TableCol from "./TableCol";

const TableColArray = TableCol.extend`
  text-align: right;
  span + span {
    font-size: 80%;
    opacity: 0.8;
  }
`;

export default TableColArray;
