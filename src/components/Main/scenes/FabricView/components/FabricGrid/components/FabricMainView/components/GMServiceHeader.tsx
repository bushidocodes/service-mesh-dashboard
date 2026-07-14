import StatusIcon from "components/StatusIcon";
import ServicesIcon from "images/icons/services.svg";
import { spacingScale } from "style/styleFunctions";
import { FONT_SIZE_LG } from "style/styleVariables";
import styled from "styled-components";

const Heading = styled.div`
  font-size: ${FONT_SIZE_LG};
  text-align: left;
  vertical-align: text-bottom;
  padding: 0;
  height: ${spacingScale(5)};
  display: flex;
  align-items: center;
  text-transform: capitalize;
`;

const IconWrapper = styled.div`
  width: ${spacingScale(3)};
  height: ${spacingScale(3)};
  position: relative;
  top: -4px;
`;

const HeaderTitle = styled.span`
  margin-left: ${spacingScale(1)};
`;

interface GMServiceHeaderProps {
  headerTitle: string;
  showStatusIcon?: boolean;
}

/**
 * Grouping header with icon and title
 */
export default function GMServiceHeader({
  headerTitle,
  showStatusIcon = false
}: GMServiceHeaderProps) {
  return (
    <Heading data-testid="service-section-header">
      {showStatusIcon ? (
        <IconWrapper>
          <StatusIcon status={headerTitle} />
        </IconWrapper>
      ) : (
        <IconWrapper>
          <img src={ServicesIcon} alt="" />
        </IconWrapper>
      )}
      <HeaderTitle>{headerTitle}</HeaderTitle>
    </Heading>
  );
}
