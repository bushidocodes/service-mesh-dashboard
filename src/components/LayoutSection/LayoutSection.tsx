import React from "react";

import LayoutSectionWrap from "./components/LayoutSectionWrap";
import Header from "./components/Header";
import SectionContent from "./components/SectionContent";
import SectionIcon from "./components/SectionIcon";
import SectionTitle from "./components/SectionTitle";
import Icon from "components/Icon";
import Glyph from "components/Glyphs/";

interface LayoutSectionProps {
  children?: React.ReactNode;
  className?: string;
  flex?: boolean;
  icon?: string;
  title: string;
}

/**
 * Section of a static dashboard, complete with header and icon
 * @param {Object} props - refer to propTypes
 */

function LayoutSection({
  children,
  title,
  icon,
  flex = false
}: LayoutSectionProps) {
  return (
    <LayoutSectionWrap>
      <Header>
        <SectionIcon>
          <Icon>
            <Glyph name={icon} />
          </Icon>
        </SectionIcon>
        <SectionTitle>{title}</SectionTitle>
      </Header>
      <SectionContent flex={flex}>{children}</SectionContent>
    </LayoutSectionWrap>
  );
}

export default LayoutSection;
