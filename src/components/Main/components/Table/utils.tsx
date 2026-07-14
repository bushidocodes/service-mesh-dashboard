import TableColHeader from "components/Main/components/TableColHeader";
import TableColLatencyHeader from "components/Main/components/TableColLatencyHeader";
import React from "react";
import { FormattedMessage } from "react-intl";
/** function getTableHeaders
 * takes Table type and returns appropriate headers with styling
 * for Function/Routes Table or GMServiceTable (Instances Table)
 * @param {object} items
 * @returns {React.element}
 */
export const getTableHeaders = (type = "") => {
  // React 19's @types/react types ReactElement.props as `unknown`, so parameterize
  // the element props to keep `header.props.defaultMessage` readable below.
  let headerNames: React.ReactElement<{ defaultMessage: string }>[] = [];
  if (type === "Instance") {
    headerNames = [
      <FormattedMessage
        key="table.instance"
        id="table.instance"
        defaultMessage="Instance"
        description="Service view table header title"
      />,
      <FormattedMessage
        key="table.uptime"
        id="table.uptime"
        defaultMessage="Uptime"
        description="Service view table header title"
      />
    ];
  } else {
    headerNames = [
      <FormattedMessage
        key={`table.${type.toLowerCase()}`}
        id={`table.${type.toLowerCase()}`}
        defaultMessage={type}
        description="Metrics table header title - either 'Route' or 'Function'"
      />,
      <FormattedMessage
        key="table.requestsSec"
        id="table.requestsSec"
        defaultMessage="Requests/sec"
        description="Metrics table header title"
      />,
      <FormattedMessage
        key="table.requests"
        id="table.requests"
        defaultMessage="Requests"
        description="Metrics table header title"
      />,
      <FormattedMessage
        key="table.errorPercent"
        id="table.errorPercent"
        defaultMessage="Error %"
        description="Metrics table header title"
      />,
      <FormattedMessage
        key="table.latency"
        id="table.latency"
        defaultMessage="Latency"
        description="Metrics table header title"
      />
    ];
  }
  let styleProps = {};

  // apply greater flex-basis for first column (20%)
  // requests/sec is a sparkline header and set to align left
  // set text-align to right for additional text columns
  return headerNames.map((header, headerIdx) => {
    styleProps = {};
    let headerName = header.props.defaultMessage;
    if (headerIdx === 0) styleProps = { flex: "1 1 20%" };
    if (headerIdx !== 0 && headerName !== "Requests/sec")
      styleProps = { textAlign: "right" };

    if (headerName === "Latency") {
      return <TableColLatencyHeader key={headerName} />;
    } else {
      return (
        <TableColHeader style={styleProps} key={headerName}>
          {header}
        </TableColHeader>
      );
    }
  });
};

// simple helper that evaluates and returns route or func props
export const getItem = (route: any, func: any) => {
  if (route !== undefined) return route;
  if (func !== undefined) return func;
};
