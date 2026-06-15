import React from "react";
import _ from "lodash";

import TableLineItem from "./components/TableLineItem";
import GMServiceTableLineItem from "./components/GMServiceTableLineItem";
import UpTime from "components/UpTime";
import ArrayValue from "components/ArrayValue";
import TableDisplay from "components/Main/components/TableDisplay";
import TableHeader from "components/Main/components/TableHeader";
import TableBody from "components/Main/components/TableBody";
import { relativeReqPercent } from "utils";
// Table-specific utils functions
import { getTableHeaders, getItem } from "./utils";

interface TableProps {
  items?: any[];
  selectedServiceSlug?: string;
  serviceIsMetered?: boolean;
  status?: string;
  type?: string;
}

/** Renders JVM > Routes table, Go > Functions table, Go > Routes table, Instance Service table
 * Includes a Header and maps 0..n rows of functions data to TableLineItems
 * @export
 * @param {any}
 * @returns
 */
function Table({
  items,
  type,
  selectedServiceSlug,
  serviceIsMetered,
  status
}: TableProps) {
  // adds relativeReqPercent field to items for viz-fill-bar rendering to Route/Function table
  if (type === "Route" || type === "Function")
    items = relativeReqPercent(items, "requests");

  return (
    <TableDisplay>
      <TableHeader>{getTableHeaders(type)}</TableHeader>
      <TableBody>
        {(type === "Route" || type === "Function") &&
          items.map(
            ({
              func,
              route,
              verb,
              errorPercent,
              inThroughput,
              outThroughput,
              latency50,
              latency99,
              relativeReqPercent,
              requests,
              requestsPerSecond_dygraph,
              requestsPerSecond_sparkline
            }) => (
              <TableLineItem
                errorPercent={errorPercent}
                item={getItem(func, route)}
                key={_.replace(`${func}${route}/${verb}`, "undefined", "")}
                latency50={latency50}
                latency99={latency99}
                relativeReqPercent={relativeReqPercent}
                requests={requests}
                requestsPerSecond_dygraph={requestsPerSecond_dygraph}
                requestsPerSecond_sparkline={requestsPerSecond_sparkline}
                verb={verb}
              />
            )
          )}
        {type === "Instance" &&
          items.map((instance) => (
            <GMServiceTableLineItem
              name={instance.name}
              serviceIsMetered={serviceIsMetered}
              uptime={
                <UpTime
                  startTime={instance.start_time}
                  render={(uptime: any) => (
                    <ArrayValue>
                      {_.map(uptime, (el) => (
                        <span key={el}>{el} </span>
                      ))}
                    </ArrayValue>
                  )}
                />
              }
              path={`/${selectedServiceSlug}/${instance.name}`}
              status={status}
              key={`${selectedServiceSlug}/${instance.name}`}
            />
          ))}
      </TableBody>
    </TableDisplay>
  );
}

export default Table;
