import { contrastColor, spacingScale } from "style/styleFunctions";
import {
  COLOR_CONTENT_BACKGROUND,
  COLOR_CONTENT_MUTED,
  FONT_SIZE_XS,
  FONT_WEIGHT_SEMIBOLD
} from "style/styleVariables";
import styled from "styled-components";

const LineItemStyle = styled.div`
  margin-right: ${spacingScale(0.5)};
  align-self: center;
  flex: 0 0 auto;
`;

const ItemName = styled(LineItemStyle)<{ clickable?: boolean }>`
  margin-right: ${spacingScale(1)};
  font-weight: ${FONT_WEIGHT_SEMIBOLD};
  flex: 0 1 auto;
`;

const ItemIcon = styled(LineItemStyle)`
  flex: 0 0 auto;
  margin-left: -${spacingScale(0.5)};
  margin-right: -${spacingScale(0.25)};
`;

const ItemRuntime = styled(LineItemStyle)`
  justify-self: flex-end;
  flex: 0 1 auto;

  > span {
    color: ${COLOR_CONTENT_MUTED.string()};
    font-size: ${FONT_SIZE_XS};
    letter-spacing: 0.08em;
    font-weight: ${FONT_WEIGHT_SEMIBOLD};
    border-radius: 3px;
    padding: 2px ${spacingScale(0.65)};
    background-color: ${contrastColor(
      COLOR_CONTENT_BACKGROUND,
      0.025
    ).string()};
  }
`;

const ItemVersion = styled(LineItemStyle)`
  flex: 0 1 auto;
  text-align: right;
`;

export { ItemIcon, ItemName, ItemRuntime, ItemVersion };
