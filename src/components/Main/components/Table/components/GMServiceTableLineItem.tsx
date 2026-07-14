import NoMetrics from "components/Glyphs/NoMetrics";
import Icon from "components/Icon";

import TableCol from "components/Main/components/TableCol";
import TableColArray from "components/Main/components/TableColArray";
import TableRow from "components/Main/components/TableRow";
import GMLink from "components/Main/scenes/FabricView/components/GMLink";
import Tooltip from "components/Tooltip";
import React from "react";
import { injectIntl } from "utils/injectIntl";

interface GMServiceTableLineItemProps {
  intl: any;
  name: string;
  path: string;
  serviceIsMetered?: boolean;
  status?: string;
  uptime?: React.ReactNode;
}

function GMServiceTableLineItem({
  status,
  name,
  uptime,
  path,
  serviceIsMetered,
  intl
}: GMServiceTableLineItemProps) {
  // this is done to search up the DOM tree to find table row and take away its focus to prevent outline on click while preserving tabbing outline
  const blurTableRow = (e: any) => {
    let node = e.target;
    while (
      typeof node.className !== "string" ||
      !node.className.startsWith("TableRow")
    ) {
      node = node.parentNode;
    }
    node.blur();
  };

  return (
    <TableRow
      tabIndex={-1}
      onClick={(evt) => blurTableRow(evt)}
      overflowVisible
      data-testid="instance-row"
    >
      <TableCol style={{ flex: "1 1 20%" }}>
        {!serviceIsMetered && (
          <Icon title="No Metrics">
            <NoMetrics />
          </Icon>
        )}
        <Tooltip
          position="left"
          disabled={serviceIsMetered}
          containerStyle={{ border: "none" }}
          content={intl.formatMessage({
            id: "GMServiceTableLineItem.tooltip",
            defaultMessage:
              "This microservice instance does not have metrics to display.",
            description: "Tooltip content"
          })}
        >
          <GMLink
            disabled={!serviceIsMetered}
            onClick={
              serviceIsMetered
                ? null
                : (e: React.MouseEvent) => e.preventDefault()
            }
            to={path}
          >
            {name}
          </GMLink>
        </Tooltip>
      </TableCol>
      <TableColArray data-testid="instance-uptime">{uptime}</TableColArray>
    </TableRow>
  );
}

export default injectIntl(GMServiceTableLineItem);
