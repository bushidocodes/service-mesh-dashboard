import React from "react";
import styled from "styled-components";
import { upperFirst } from "utils/collections";
import { microserviceStatuses } from "utils/constants";

// TODO: Refactor as either styled-component or functional component, not both
// Added explicit width to align title properly pending icon rework.

import Icon from "components/Icon";
import StatusIcon from "components/StatusIcon";

const TabIconContainer = styled.span`
  display: flex;
  align-items: center;
  width: 25px;
`;

interface TabIconProps {
  children?: React.ReactNode;
  name?: string;
}

/**
 * Renders TabIcon.  If the icon is one of the microserviceStatuses [Down, Warning, Stable], render a corresponding StatusIcon, otherwise render an Icon with Glyph component passed in as props.children
 * @function TabIcon
 * @param {any} { children, name }
 * @returns JSX elements
 */
function TabIcon({ children, name }: TabIconProps) {
  if (microserviceStatuses.includes(upperFirst(name))) {
    return (
      <TabIconContainer>
        <StatusIcon status={name} backgroundColor={"currentColor"} />
      </TabIconContainer>
    );
  }
  return (
    <TabIconContainer>
      <Icon>{children}</Icon>
    </TabIconContainer>
  );
}

export default TabIcon;
