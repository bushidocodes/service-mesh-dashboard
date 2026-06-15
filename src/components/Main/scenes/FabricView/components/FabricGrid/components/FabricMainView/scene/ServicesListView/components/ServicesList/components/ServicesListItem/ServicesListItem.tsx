import React, { Component } from "react";

import { Line, LineLeft, LineRight } from "./components/Line";
import {
  ItemName,
  ItemVersion,
  ItemIcon,
  ItemRuntime
} from "./components/Item";
import IconWrapper from "./components/IconWrapper";
import DocsLink from "./components/DocsLink";

import Icon from "components/Icon";
import NoKey from "components/Glyphs/NoKey";
import Docs from "components/Glyphs/Docs";
import NoMetrics from "components/Glyphs/NoMetrics";

import StatusIcon from "components/StatusIcon";
import GMLink from "components/Main/scenes/FabricView/components/GMLink";

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

export default class ServicesListItem extends Component<ServicesListItemProps> {
  manageFocus = (node, e) => {
    if (node) {
      // the row is composed of a div encapsulating an a tag, clicking that produces an outline may fall on ether of those elements, thus we want to remove focus from ether one
      node.tagName === "A" ? node.blur() : node.parentNode.blur();
    }
    e.preventDefault();
  };

  render() {
    const {
      authorized,
      metered,
      name,
      runtime,
      slug,
      status,
      version,
      docsLink,
      groupByAttribute = ""
    } = this.props;

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
      <Line>
        <LineLeft>
          <GMLink
            disabled={!isAccessible}
            tabIndex="0"
            onClick={isAccessible ? null : (e) => this.manageFocus(e.target, e)}
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
}
