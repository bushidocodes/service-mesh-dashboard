import React from "react";

import TableBody from "components/Main/components/TableBody";
import ThreadsTableLineItem from "./ThreadsTableLineItem";

interface ThreadsListProps {
  threads: unknown[];
}

/**
 * Parent component that renders ThreadsTableLineItems
 * @export
 * @param {Object[]} { threads }
 * @returns JSX.Element
 */

export default function ThreadsList({ threads }: ThreadsListProps) {
  return (
    <TableBody>
      {threads.map(({ daemon, id, name, priority, stack, state, header }) => {
        return (
          <ThreadsTableLineItem
            {...{ daemon, name, priority, stack, state }}
            id={Number(id)}
            key={id}
          />
        );
      })}
    </TableBody>
  );
}
