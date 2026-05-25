import { PropTypes } from "prop-types";
import React from "react";

import DataDisplay from "./DataDisplay";
import DataTitle from "./DataTitle";
import DataPair from "./DataPair";
import DataKey from "./DataKey";
import DataValue from "./DataValue";
import DataKeyHeader from "./DataKeyHeader";

GMTable.propTypes = {
  headers: PropTypes.array.isRequired,
  rows: PropTypes.array.isRequired,
  title: PropTypes.string.isRequired
};

/**
 * Basic spreadsheet-style table view showing mupltiple columns and multiple rows
 * @param {Object} props
 */
export default function GMTable({ title, headers, rows = [] }) {
  return (
    <DataDisplay table>
      <DataTitle>{title}</DataTitle>
      <DataPair>
        {headers.map((headerCell, index) => (
          <DataKeyHeader key={`header-${index}`}>{headerCell}</DataKeyHeader>
        ))}
      </DataPair>
      {rows.map((row, rowIndex) => (
        <DataPair key={`row-${rowIndex}`}>
          {row &&
            row.map((cell, cellIndex) =>
              cellIndex === 0 ? (
                <DataKey key={`row-${rowIndex}-cell-${cellIndex}`}>
                  {cell.toLocaleString()}
                </DataKey>
              ) : (
                <DataValue key={`row-${rowIndex}-cell-${cellIndex}`}>
                  {cell.toLocaleString()}
                </DataValue>
              )
            )}
        </DataPair>
      ))}
    </DataDisplay>
  );
}
