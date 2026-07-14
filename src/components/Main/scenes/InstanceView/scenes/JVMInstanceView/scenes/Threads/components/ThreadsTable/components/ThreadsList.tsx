import TableBody from "components/Main/components/TableBody";
import type { ThreadsTableItem } from "types";
import ThreadsTableLineItem from "./ThreadsTableLineItem";

interface ThreadsListProps {
  threads: ThreadsTableItem[];
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
      {threads.map(({ daemon, id, name, priority, stack, state }) => {
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
