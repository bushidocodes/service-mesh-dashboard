import styled from "styled-components";

import { COLOR_BRAND_PRIMARY, COLOR_WHITE } from "style/styleVariables";
import { contrastColor } from "style/styleFunctions";

const BRAND = COLOR_BRAND_PRIMARY.toString();
const TRACK = contrastColor(COLOR_WHITE, 0.1).toString();
const DISABLED = contrastColor(COLOR_WHITE, 0.6).toString();

// Native range input styled to replace the unmaintained `react-input-range`
// package (which pinned the project to React 15/16 peer deps). A styled
// <input type="range"> has zero dependencies, is fully keyboard-accessible
// out of the box, and works on React 18.
//
// Range inputs require vendor-specific pseudo-elements to style the thumb and
// track; the -webkit- and -moz- blocks cannot be combined into one selector
// list (browsers drop the whole rule if any selector is unknown), so they are
// duplicated intentionally.
const InputRange = styled.input.attrs({ type: "range" })`
  appearance: none;
  width: 100%;
  height: 6px;
  margin: 12px 0;
  border-radius: 20px;
  background: ${TRACK};
  outline: none;
  cursor: pointer;

  &::-webkit-slider-thumb {
    /* stylelint-disable-next-line property-no-vendor-prefix */
    -webkit-appearance: none;
    appearance: none;
    width: 16px;
    height: 16px;
    border: none;
    border-radius: 0;
    background: ${BRAND};
    cursor: pointer;
    transition: transform 0.3s ease;
  }
  &::-moz-range-thumb {
    width: 16px;
    height: 16px;
    border: none;
    border-radius: 0;
    background: ${BRAND};
    cursor: pointer;
    transition: transform 0.3s ease;
  }

  &:disabled {
    cursor: default;
  }

  &:hover::-webkit-slider-thumb,
  &:focus::-webkit-slider-thumb {
    transform: scale(1.1);
  }
  &:hover::-moz-range-thumb,
  &:focus::-moz-range-thumb {
    transform: scale(1.1);
  }

  &:disabled::-webkit-slider-thumb {
    background: ${DISABLED};
    cursor: default;
    transform: none;
  }
  &:disabled::-moz-range-thumb {
    background: ${DISABLED};
    cursor: default;
    transform: none;
  }
`;

export default InputRange;
