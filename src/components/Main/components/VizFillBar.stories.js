import React from "react";

import StoryRouter from "storybook-router";
import { storiesOf } from "@storybook/react";
import { withKnobs, number } from "@storybook/addon-knobs/react";

import TableColVizBar from "components/Main/components/TableColVizBar";
import VizBar from "components/Main/components/VizBar";
import VizFill from "components/Main/components/VizFill";

storiesOf("Vizfill bar", module)
  .addDecorator(withKnobs)
  .addDecorator(StoryRouter())
  .add("Vizfill bar", () => (
    <div style={{ display: "flex" }}>
      <TableColVizBar>
        <VizBar>
          <VizFill
            width={number("Volume", 50, {
              range: true,
              min: 0,
              max: 100,
              step: 5
            })}
            colorDegree={number("Error Percent", 50, {
              range: true,
              min: 0,
              max: 100,
              step: 5
            })}
          />
        </VizBar>
        {"Volume "}
        {number("Volume", 50, {
          range: true,
          min: 0,
          max: 100,
          step: 5
        })}
        %{" Error Percent "}
        {number("Error Percent", 50, {
          range: true,
          min: 0,
          max: 100,
          step: 5
        })}
        %
      </TableColVizBar>
    </div>
  ));
