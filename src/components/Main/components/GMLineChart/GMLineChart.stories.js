import React from "react";

import GMLineChart from "./GMLineChart";

export default {
  title: "GMLineChart",
  component: GMLineChart
};

export const Default = {
  render: () => {
    const title = "Awesomeness Factor";
    const baseUnit = "B";
    const resultUnit = "MB";
    const label = "Heap Used";
    const precision = 3;
    const detailLines = ["Total Loaded: 10,200", "Total Unloaded: 19"];
    const dygraphOptions = {
      animatedZooms: true,
      axisLineColor: "rgb(200, 200, 200)",
      colors: ["#0aab2a", "#002e6e", "#FF5733"],
      drawAxesAtZero: true,
      gridLineColor: "rgb(200, 200, 200)",
      gridLinePattern: [1, 3],
      includeZero: true,
      labelsSeparateLines: true,
      labelsKMB: true,
      fillGraph: true,
      strokeWidth: 2.0,
      legend: "always"
    };
    const height = "normal";
    const dygraphMetadata = {
      "wakka/wakka/heap_used": {
        baseUnit: baseUnit,
        label: label,
        precision: precision,
        resultUnit: resultUnit
      }
    };
    return (
      <GMLineChart
        detailLines={detailLines}
        dygraph={{
          data: [
            [new Date("Wed Nov 29 2017 18:45:51 GMT-0500 (EST)"), 10181],
            [new Date("Wed Nov 29 2017 18:46:51 GMT-0500 (EST)"), 9181],
            [new Date("Wed Nov 29 2017 18:47:51 GMT-0500 (EST)"), 7181],
            [new Date("Wed Nov 29 2017 18:48:51 GMT-0500 (EST)"), 5181],
            [new Date("Wed Nov 29 2017 18:49:51 GMT-0500 (EST)"), 10181],
            [new Date("Wed Nov 29 2017 18:50:51 GMT-0500 (EST)"), 9181]
          ],
          attributes: ["wakka/wakka/heap_used"]
        }}
        dygraphMetadata={dygraphMetadata}
        dygraphOptions={dygraphOptions}
        expectedAttributes={["wakka/wakka/heap_used"]}
        height={height}
        title={title}
      />
    );
  }
};
