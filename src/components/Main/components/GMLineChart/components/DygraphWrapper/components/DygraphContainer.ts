import { spacingScale } from "style/styleFunctions";

import {
  BORDER_RADIUS_BASE,
  COLOR_CONTENT,
  FONT_STACK_DATA,
  FONT_WEIGHT_SEMIBOLD
} from "style/styleVariables";
import styled from "styled-components";

const DygraphContainer = styled.div`
  font-family: ${FONT_STACK_DATA};
  position: absolute;
  top: 0;
  right: 0;
  left: 0;
  bottom: 0;
  /* dygraphs (>=2.2) reads getComputedStyle(maindiv).padding* and logs
     "Main div contains padding; graph will misbehave" unless every padding
     longhand resolves to exactly "0px". This is already the visual default, so
     declaring it is a no-op for appearance — but it (a) satisfies that check in
     real browsers and (b) makes jsdom's getComputedStyle return "0px" instead
     of "" in tests, which otherwise trips the console.error-as-throw setup. */
  padding: 0;
  background-color: inherit;

  > * {
    background-color: inherit;
  }

  .dygraph-legend {
    background-color: rgba(255, 255, 255, 0.9);
    border-radius: ${BORDER_RADIUS_BASE};
    color: ${COLOR_CONTENT.opaquer(0.2).hsl().string()};
    display: inline-block;
    left: auto !important;
    min-width: 18em;
    opacity: 0;
    padding: ${spacingScale(1)} ${spacingScale(2)} ${spacingScale(1)};
    position: absolute;
    right: 0 !important;
    text-align: right;
    transition:
      all 0.2s ease,
      color 0.2s ease;
    z-index: 10000;

    /* TODO: Fix this selector */
    & [style*="bold"] {
      font-weight: ${FONT_WEIGHT_SEMIBOLD} !important;
    }
  }

  &:hover .dygraph-legend {
    color: ${COLOR_CONTENT.opaquer(0.2).hsl().string()};
    opacity: 1;
    transition:
      all 0.2s ease,
      color 1s ease;
  }

  .dygraph-label {
    color: ${COLOR_CONTENT};
    opacity: 0.8;
  }
`;

export default DygraphContainer;
