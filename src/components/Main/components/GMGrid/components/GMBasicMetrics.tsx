import {
  Sparklines,
  SparklinesLine,
  SparklinesReferenceLine
} from "components/Sparklines";

import DataDisplay from "./DataDisplay";
import DataKey from "./DataKey";
import DataPair from "./DataPair";
import DataSparkline from "./DataSparkline";
import DataTitle from "./DataTitle";
import DataValue from "./DataValue";

interface GMBasicMetricsProps {
  detailLines: any[];
  title: string;
}

/**
 * Basic component for rendering a group of related metrics. Includes sparklines
 * @param {Object} props - refer to propTypes
 */
export default function GMBasicMetrics({
  detailLines,
  title
}: GMBasicMetricsProps) {
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
