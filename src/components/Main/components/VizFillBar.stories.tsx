import TableColVizBar from "components/Main/components/TableColVizBar";
import VizBar from "components/Main/components/VizBar";
import VizFill from "components/Main/components/VizFill";
import React from "react";

export default {
  title: "Vizfill bar"
};

export const VizfillBar = {
  render: () => (
    <div style={{ display: "flex" }}>
      <TableColVizBar>
        <VizBar>
          <VizFill width={50} colorDegree={50} />
        </VizBar>
        {"Volume "}
        {50}%{" Error Percent "}
        {50}%
      </TableColVizBar>
    </div>
  )
};
