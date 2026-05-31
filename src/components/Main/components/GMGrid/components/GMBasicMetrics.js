import { PropTypes } from "prop-types";
import React from "react";
import {
  Sparklines,
  SparklinesLine,
  SparklinesReferenceLine
} from "components/Sparklines";

import DataDisplay from "./DataDisplay";
import DataTitle from "./DataTitle";
import DataPair from "./DataPair";
import DataKey from "./DataKey";
import DataValue from "./DataValue";
import DataSparkline from "./DataSparkline";

GMBasicMetrics.propTypes = {
  detailLines: PropTypes.array.isRequired,
  title: PropTypes.string.isRequired
};

/**
 * Basic component for rendering a group of related metrics. Includes sparklines
 * @param {Object} props - refer to propTypes
 */
export default function GMBasicMetrics({ detailLines, title }) {
  return (
    <DataDisplay>
      <DataTitle>{title}</DataTitle>
      {detailLines.map(([heading, value, priority, sparkline = []]) => {
        return (
          <DataPair priority={priority} key={`${heading}-${value}`}>
            <DataKey>{heading}</DataKey>
            <DataValue>
              {value.toLocaleString()}
              {sparkline.length > 0 && (
                <DataSparkline>
                  <Sparklines
                    data={sparkline}
                    height={32}
                    preserveAspectRatio="xMaxYMin"
                  >
                    <SparklinesLine
                      style={{
                        stroke: "currentColor",
                        strokeWidth: 1,
                        fill: "none"
                      }}
                    />
                    <SparklinesReferenceLine
                      style={{
                        stroke: "grey",
                        opacity: "0.4"
                      }}
                      type="mean"
                    />
                  </Sparklines>
                </DataSparkline>
              )}
            </DataValue>
          </DataPair>
        );
      })}
    </DataDisplay>
  );
}
