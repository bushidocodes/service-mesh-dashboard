import styled from "styled-components";

import GMLink from "components/Main/scenes/FabricView/components/GMLink";
import { spacingScale, contrastColor } from "style/styleFunctions";
import {
  FONT_SIZE_XS,
  COLOR_CONTENT_MUTED,
  COLOR_CONTENT_BACKGROUND,
  FONT_WEIGHT_SEMIBOLD
} from "style/styleVariables";

const LineItemStyle = styled.div`
  margin-right: ${spacingScale(0.5)};
  align-self: center;
  flex: 0 0 auto;
`;

const ItemName = LineItemStyle.extend`
  margin-right: ${spacingScale(1)};
  font-weight: ${FONT_WEIGHT_SEMIBOLD};
  flex: 0 1 auto;
`;

const ItemIcon = LineItemStyle.extend`
  flex: 0 0 auto;
  margin-left: -${spacingScale(0.5)};
  margin-right: -${spacingScale(0.25)};
`;

const ItemRuntime = LineItemStyle.extend`
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

const ItemVersion = LineItemStyle.extend`
  flex: 0 1 auto;
  text-align: right;
`;

const ItemInfo = GMLink.withComponent("div").extend`
&:hover {
color: inherit;
}
`;

export { ItemName, ItemVersion, ItemIcon, ItemRuntime, ItemInfo };
