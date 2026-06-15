import React from "react";
import {
  Sparklines,
  SparklinesLine,
  SparklinesReferenceLine
} from "components/Sparklines";

import Glyph from "components/Glyphs/index";
import ItemDisplay from "./components/ItemDisplay";
import ReadoutItemData from "./components/ReadoutItemData";
import ReadoutItemGraph from "./components/ReadoutItemGraph";
import ReadoutItemIcon from "./components/ReadoutItemIcon";
import ReadoutItemTitle from "./components/ReadoutItemTitle";
import ReadoutItemValue from "./components/ReadoutItemValue";
import ReadoutItemDetail from "./components/ReadoutItemDetail";

export interface ReadoutItemData {
  cacheCard?: boolean;
  children?: React.ReactElement;
  detail?: string;
  graphData?: number[];
  icon?: string;
  iconBackgroundStyle?: string;
  iconBorderStyle?: string;
  iconBorderWidth?: number | string;
  iconColor?: string;
  iconName?: string;
  iconShape?: string;
  title?: string;
  value?: any;
}

//  TO-DO:  icon name, shape, color and other icon specifics are to be passed to getIcon component that renders svg element
// when we have "future", "bolt", "warning", "server", "link" svg elements...

export default function ReadoutItem({
  cacheCard,
  children,
  detail,
  graphData,
  icon,
  iconName,
  iconBackgroundStyle,
  iconBorderStyle,
  iconBorderWidth,
  iconShape,
  iconColor,
  title,
  value
}: ReadoutItemData) {
  return (
    <ItemDisplay cacheCard={cacheCard}>
      {icon && (
        <ReadoutItemIcon
          iconBackgroundStyle={iconBackgroundStyle}
          iconBorderStyle={iconBorderStyle}
          iconBorderWidth={iconBorderWidth || "2"}
        >
          <Glyph name={icon} />
        </ReadoutItemIcon>
      )}
      <ReadoutItemData>
        <ReadoutItemTitle>{title || "—"}</ReadoutItemTitle>
        <ReadoutItemValue>{value || "—"}</ReadoutItemValue>
        {detail && <ReadoutItemDetail>{detail}</ReadoutItemDetail>}
        {graphData && (
          <ReadoutItemGraph>
            <Sparklines data={graphData} height={32}>
              <SparklinesLine
                style={{ stroke: "currentColor", strokeWidth: 1, fill: "none" }}
              />
              <SparklinesReferenceLine
                style={{ stroke: "grey", opacity: "0.4" }}
                type="mean"
              />
            </Sparklines>
          </ReadoutItemGraph>
        )}
        {children}
      </ReadoutItemData>
    </ItemDisplay>
  );
}
