import React from "react";

import DataDisplay from "./DataDisplay";
import DataTitle from "./DataTitle";
import DataPair from "./DataPair";
import DataKey from "./DataKey";
import DataValue from "./DataValue";
import DataKeyHeader from "./DataKeyHeader";

interface GMTableProps {
  headers: any[];
  rows: any[];
  title: string;
}

/**
 * Basic spreadsheet-style table view showing mupltiple columns and multiple rows
 * @param {Object} props
 */
export default function GMTable({ title, headers, rows = [] }: GMTableProps) {
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
            row.map((cell: any, cellIndex: number) =>
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
