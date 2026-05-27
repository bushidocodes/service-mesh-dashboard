import React from "react";
import PropTypes from "prop-types";
import Color from "color";

// Internal Sub-components
import BackgroundIcon from "./components/BackgroundIcon";
import DocsLink from "./components/DocsLink";
import { CardContainer, CardFooter } from "./components/Card";
import Icon from "components/Icon";
import NoKey from "components/Glyphs/NoKey";
import Docs from "components/Glyphs/Docs";
import NoMetrics from "components/Glyphs/NoMetrics";
import { ServiceLink } from "./components/Service";
import Title from "./components/Title";
import Runtime from "./components/Runtime";

// External dependencies
import { mapStatusToColor, spacingScale } from "style/styleFunctions";
// import NoAuthIcon from "images/icons/no-key.svg";

GMServiceCard.propTypes = {
  authorized: PropTypes.bool,
  docsLink: PropTypes.string,
  height: PropTypes.string,
  metered: PropTypes.bool,
  name: PropTypes.string.isRequired,
  runtime: PropTypes.string,
  slug: PropTypes.string.isRequired,
  status: PropTypes.string,
  version: PropTypes.string,
  width: PropTypes.string
};

export default function GMServiceCard({
  authorized,
  docsLink,
  height = spacingScale(14),
  metered,
  name,
  runtime,
  slug,
  status,
  version,
  width = spacingScale(20)
}) {
  // Style based on the status of the service
  let cardBackgroundColor,
    cardBorderColor,
    cardFontColor,
    cardFontWeight,
    cardHighlightColor,
    cardBorderAltColor;
  const baseColor = mapStatusToColor(status).string();
  const maxNameLen = 50;
  const titleName =
    name.length > maxNameLen ? `${name.trim().substr(0, maxNameLen)}...` : name;
  let titleNameAttribute = name === titleName ? null : name;

  let isAccessible = true;
  if (!authorized || status === "Down") {
    isAccessible = false;
  }

  if (!metered) {
    titleNameAttribute = "Metrics are not available for this service.";
  } else if (!authorized) {
    titleNameAttribute = "You do not have permission to manage this service.";
  }

  switch (status) {
    case "Down":
      cardBackgroundColor = cardBorderColor = cardBorderAltColor = baseColor;
      cardHighlightColor = "#000000";
      cardFontColor = "white";
      cardFontWeight = "500";
      break;
    case "Warning":
      cardBackgroundColor = cardBorderColor = cardBorderAltColor = baseColor;
      cardHighlightColor = "#000000";
      cardFontColor = "black";
      cardFontWeight = "400";
      break;
    case "Stable":
    default:
      cardBackgroundColor = "white";
      cardBorderAltColor = baseColor;
      cardBorderColor = "rgba(0,0,0,.05)";
      cardHighlightColor = baseColor;
      cardFontWeight = "400";
      cardFontColor = Color(baseColor).darken(0.2).string();
  }

  return (
    <CardContainer
      isAccessible={isAccessible}
      cardBackgroundColor={cardBackgroundColor}
      cardBorderColor={cardBorderColor}
      cardFontColor={cardFontColor}
      cardHighlightColor={cardHighlightColor}
      cardBorderAltColor={cardBorderAltColor}
      width={width}
      height={height}
      name={status}
    >
      <ServiceLink
        disabled={isAccessible ? null : true}
        onClick={isAccessible ? null : (e) => e.preventDefault()}
        title={titleNameAttribute}
        to={`/${slug}`}
      >
        <Title cardFontWeight={cardFontWeight}>{titleName}</Title>
      </ServiceLink>
      <CardFooter cardFontWeight={cardFontWeight}>
        {!metered && (
          <Icon title="No Metrics">
            <NoMetrics />
          </Icon>
        )}
        {!authorized && (
          <Icon title="Not Authorized">
            <NoKey />
          </Icon>
        )}
        {runtime && <Runtime>{runtime}</Runtime>}
        {version && <span>{version}</span>}
        {version && docsLink && (
          <DocsLink href={docsLink} target="_blank">
            <Icon title="API Documentation">
              <Docs />
            </Icon>
          </DocsLink>
        )}
      </CardFooter>
      <BackgroundIcon status={status} alt={status} />
    </CardContainer>
  );
}
