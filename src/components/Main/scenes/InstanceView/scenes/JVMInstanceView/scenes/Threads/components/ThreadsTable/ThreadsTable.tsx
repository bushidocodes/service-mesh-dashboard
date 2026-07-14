import TableColHeader from "components/Main/components/TableColHeader";
import TableDisplay from "components/Main/components/TableDisplay";
import React from "react";
import type { ThreadsTableItem } from "types";
import { isEmpty } from "utils/collections";
import { threadStates } from "utils/constants";
import ThreadsList from "./components/ThreadsList";
import ThreadsTableHeader from "./components/ThreadsTableHeader";
import ThreadsTableStatusHeader from "./components/ThreadsTableStatusHeader";

interface ThreadsTableProps {
  filteredThreadData?: any[];
  groupByAttribute?: string;
}

/**
 * Renders a table and appropriate headers based on the provided thread data.
 * Defaults are expressed as JS default parameters rather than defaultProps,
 * which React deprecated for function components.
 * @export
 * @param {Object[]} { filteredThreadData = [] }
 * @param {string} { groupByAttribute = "none" }
 * @returns JSX.Element
 */

export default function ThreadsTable({
  filteredThreadData = [],
  groupByAttribute = "none"
}: ThreadsTableProps) {
  // If we are grouping threads by state, we need to render headers

  if (groupByAttribute === "state") {
    // Add a header property to each thread object
    // based on its state so that they can be grouped
    const mappedThreads = filteredThreadData.map((thread) => {
      return {
        ...thread,
        header: getHeader(thread, groupByAttribute)
      };
    });

    // Create an object with keys matching headers
    // and values being an array of corresponding thread objects.
    const dataGroupedByHeader = Object.groupBy(
      mappedThreads,
      (thread: ThreadsTableItem) => thread.header ?? "none"
    );

    // Loop through thread states to preserve the order stopped, idle, active
    // only include headers that have corresponding threads
    let headers = threadStates.filter(
      (header) => !isEmpty(dataGroupedByHeader[header])
    );

    return (
      <TableDisplay>
        <ThreadsTableHeader />
        {headers.map((header, idx) => [
          <ThreadsTableStatusHeader key={`header|${header}|${idx}`}>
            <TableColHeader>{header}</TableColHeader>
          </ThreadsTableStatusHeader>,
          <ThreadsList
            threads={dataGroupedByHeader[header] ?? []}
            key={`list|${header}|${idx}`}
          />
        ])}
      </TableDisplay>
    );
  } else {
    return (
      <TableDisplay>
        <ThreadsTableHeader />
        <ThreadsList threads={filteredThreadData} />
      </TableDisplay>
    );
  }
}

function getHeader(thread: ThreadsTableItem, groupByAttribute: string) {
  switch (thread.state) {
    case "RUNNABLE":
      return "Active";
    case "WAITING":
    case "TIMED_WAITING":
      return "Idle";
    case "TERMINATED":
    case "BLOCKED":
    case "NEW":
      return "Stopped";
    case "None":
    default:
      return "none";
  }
}
