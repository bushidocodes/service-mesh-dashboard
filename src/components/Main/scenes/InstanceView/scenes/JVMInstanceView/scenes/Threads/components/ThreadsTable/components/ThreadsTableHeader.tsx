import React from "react";
import { FormattedMessage } from "react-intl";

import TableHeader from "components/Main/components/TableHeader";
import TableColHeaderThread from "components/Main/components/TableColHeaderThread";
import TableColHeader from "components/Main/components/TableColHeader";

/**
 * Stateless functional component that renders threads header columns
 * @returns JSX.Element
 */

// last empty column is placeholder for thread icon
export default function ThreadsTableHeader() {
  return (
    <TableHeader>
      <TableColHeaderThread style={{ textAlign: "center" }}>
        <FormattedMessage
          id="threadsTableHeader.state"
          defaultMessage="State"
          description="Header title"
        />
      </TableColHeaderThread>
      <TableColHeaderThread style={{ textAlign: "center" }}>
        <FormattedMessage
          id="threadsTableHeader.id"
          defaultMessage="ID"
          description="Header title"
        />
      </TableColHeaderThread>
      <TableColHeader>
        <FormattedMessage
          id="threadsTableHeader.name"
          defaultMessage="Name"
          description="Header title"
        />
      </TableColHeader>
      <TableColHeaderThread style={{ textAlign: "right", flex: "0 1 7em" }}>
        <FormattedMessage
          id="threadsTableHeader.daemon"
          defaultMessage="Daemon"
          description="Header title"
        />
      </TableColHeaderThread>
      <TableColHeaderThread style={{ textAlign: "right", flex: "0 1 7em" }}>
        <FormattedMessage
          id="threadsTableHeader.priority"
          defaultMessage="Priority"
          description="Header title"
        />
      </TableColHeaderThread>
      <TableColHeaderThread />
    </TableHeader>
  );
}
