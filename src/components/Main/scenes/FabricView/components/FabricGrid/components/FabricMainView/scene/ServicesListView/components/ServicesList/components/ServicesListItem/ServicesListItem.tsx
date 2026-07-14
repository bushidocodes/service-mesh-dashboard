import Docs from "components/Glyphs/Docs";
import NoKey from "components/Glyphs/NoKey";
import NoMetrics from "components/Glyphs/NoMetrics";
import Icon from "components/Icon";
import GMLink from "components/Main/scenes/FabricView/components/GMLink";
import StatusIcon from "components/StatusIcon";
import type { MouseEvent } from "react";
import DocsLink from "./components/DocsLink";
import IconWrapper from "./components/IconWrapper";
import {
  ItemIcon,
  ItemName,
  ItemRuntime,
  ItemVersion
} from "./components/Item";
import { Line, LineLeft, LineRight } from "./components/Line";

interface ServicesListItemProps {
  authorized?: boolean;
  docsLink?: string;
  groupByAttribute?: string;
  instances?: unknown[];
  metered?: boolean;
  name: string;
  runtime?: string;
  slug?: string;
  status?: string;
  version?: string;
}

function manageFocus(node: EventTarget | null, e: MouseEvent) {
  if (node && node instanceof HTMLElement) {
    // the row is composed of a div encapsulating an a tag, clicking that produces an outline may fall on ether of those elements, thus we want to remove focus from ether one
    node.tagName === "A" ? node.blur() : node.parentElement?.blur();
  }
  e.preventDefault();
}

function ServicesListItem({
  authorized,
  metered,
  name,
  runtime,
  slug,
  status,
  version,
  docsLink,
  groupByAttribute = ""
}: ServicesListItemProps) {
  let isAccessible = true;
  if (!authorized || status === "Down") {
    isAccessible = false;
  }

  let title = name;
  if (!metered) {
    title = "Metrics are not available for this service.";
  } else if (!authorized) {
    title = "You do not have permission to manage this service.";
  }

  return (
    <Line data-testid="service-list-item" data-status={status}>
      <LineLeft>
        <GMLink
          disabled={!isAccessible}
          tabIndex="0"
          onClick={
            isAccessible ? null : (e: MouseEvent) => manageFocus(e.target, e)
          }
          title={title}
          to={`/${slug}`}
        >
          <IconWrapper>
            {groupByAttribute.toLowerCase() !== "status" && (
              <StatusIcon status={status} />
            )}
          </IconWrapper>
          {!metered && (
            <ItemIcon>
              <Icon title="No Metrics">
                <NoMetrics />
              </Icon>
            </ItemIcon>
          )}
          {!authorized && (
            <ItemIcon>
              <Icon title="Not Authorized">
                <NoKey />
              </Icon>
            </ItemIcon>
          )}
          <ItemName clickable={isAccessible}>{name}</ItemName>
          <ItemRuntime>
            <span>{runtime}</span>
          </ItemRuntime>
        </GMLink>
      </LineLeft>
      <LineRight>
        <ItemVersion>
          <span>{version}</span>
        </ItemVersion>
        {docsLink && (
          <DocsLink href={docsLink} target="_blank">
            <Icon title="API Documentation">
              <Docs />
            </Icon>{" "}
          </DocsLink>
        )}
      </LineRight>
    </Line>
  );
}

export default ServicesListItem;
