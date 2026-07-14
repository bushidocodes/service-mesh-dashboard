import Color from "color";

import {
  CHART_HEIGHT_BASE,
  COLOR_DANGER,
  COLOR_STOP_1,
  COLOR_STOP_2,
  COLOR_STOP_3,
  COLOR_SUCCESS,
  COLOR_WARNING,
  DARK_ON_LIGHT_CONTRAST_ENHANCEMENT_RATIO,
  FONT_SIZE_BASE,
  FONT_STACK_CODE,
  LINE_HEIGHT_BASE,
  PADDING_BASE
} from "./styleVariables";

/**
 * Utility to generate a readable content color from the background color of an element
 *
 * @param {Object|string} backgroundColor - a Color libary object or a string containing a color hex
 * @param {number} contrast - a number between 0 and 1
 * @param {Object|string} intentColor  - an optional Color libary object or a string containing a color hex
 * Defaults to black or white depending on the luminosity of backgroundColor
 * @returns {Object} - A color library object
 */
export function contrastColor(
  backgroundColor: any,
  contrast?: any,
  intentColor?: any
) {
  if (!backgroundColor) {
    throw new Error("contrastColor requires a backgroundColor");
  }
  if (typeof backgroundColor === "string") {
    backgroundColor = Color(backgroundColor);
  }
  if (typeof intentColor === "string") {
    intentColor = Color(intentColor);
  }
  // luminosity() => 0 is black, 1 is white.
  // if luminosity of color is closer to light, and intentColor is null, set the intentColor to black.  if luminosity is closer to dark, and intentColor is null, set the intentColor to white.
  if (backgroundColor.luminosity() > 0.65) {
    intentColor = intentColor || Color("#000"); //black
    return backgroundColor.mix(intentColor, contrast);
  } else {
    let enhancedContrast = contrast * DARK_ON_LIGHT_CONTRAST_ENHANCEMENT_RATIO; // DARK_ON_LIGHT_CONTRAST_ENHANCEMENT_RATIO = 2
    intentColor = intentColor || Color("#FFF"); //white
    if (enhancedContrast > 1) {
      // enhancedContrast = 1
      enhancedContrast = 1;
    }
    return backgroundColor.mix(intentColor, contrast);
  }
}

/**
 * Scales a string of a certain number of pixels according to a given factor
 *
 * @export
 * @param {number} factor
 * @returns {string} A string in the format "10px"
 */
export function spacingScale(factor: number) {
  return `${Math.round(parseInt(PADDING_BASE, 10) * factor)}px`;
}

/**
 * Utility to generate a rsubtle keyline color for element separators
 *
 * @param {Object|string} backgroundColor - a Color libary object or a string containing a color hex
 * @param {number} contrast - a number between 0 and 1
 * @returns {Object} - A color library object
 */
export function edgeColor(backgroundColor: any, contrast = 0.08) {
  if (typeof backgroundColor === "string") {
    backgroundColor = Color(backgroundColor);
  }
  // If the element is very dark, use a light edge color
  if (backgroundColor.luminosity() < 0.1) {
    let enhancedContrast = contrast * DARK_ON_LIGHT_CONTRAST_ENHANCEMENT_RATIO;
    if (enhancedContrast > 1) {
      enhancedContrast = 1;
    }
    return backgroundColor.lighten(enhancedContrast);
  } else {
    // Otherwise, use a natural dark edge color
    return backgroundColor.darken(contrast);
  }
}

/**
 * Takes string representation of the status of a microservice and returns corresponding color
 * @param {string} state
 * @returns {Object} // a Color object
 */
export function mapStatusToColor(status = "") {
  switch (status.toLowerCase()) {
    case "warning":
      return COLOR_WARNING; // color orange-tan
    case "stable":
      return COLOR_SUCCESS;
    case "down":
    default:
      return COLOR_DANGER;
  }
}

/**
 * Takes no params and returns styling for table rows
 * @param {none}
 * @returns {string}
 */
export function rowChildSpacing() {
  return `
    padding-right: ${spacingScale(2)};
    padding-top: ${spacingScale(0.888)};
    padding-bottom: ${spacingScale(0.888)};
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    &:first-child {
      padding-left: ${spacingScale(2)};
  }`;
}

export function contentTypeCode() {
  return `
    font-family: ${FONT_STACK_CODE};
    white-space: pre-wrap;
    word-break: break-all;
    font-size: ${parseInt(FONT_SIZE_BASE, 10) * 0.85}px;
    line-height: ${LINE_HEIGHT_BASE * 1.1};
  `;
}

/**
 * function errorColor
 * takes errorPercent as number(0.1% passed in as .1 not .001) and returns string color (green to red)
 * < 0.1% error rate is green, > 0.1% and < 1% is (green to red) and >1% is red
 *
 * @param {number|string} errorPercent
 * @returns {string} - color for the errorPercent text
 */

export function errorColor(errorPercent: string | number = 1) {
  const percent =
    typeof errorPercent === "number" ? errorPercent : parseFloat(errorPercent);
  if (percent < 0.1) return COLOR_STOP_1.string();
  else if (percent > 0.1 && percent < 1) return COLOR_STOP_2.string();
  else return COLOR_STOP_3.string();
}

/**
 * function chartHeight
 * takes height as string and returns height attribute.
 * if height is not one of the prespecified strings, returns height 100%
 * @param {string} height ("xs", "sm", "normal", "lg", "xl", "max")
 * @returns {string} - height attribute
 */
export const chartHeight = (height: string) => {
  let factor;
  switch (height) {
    case "normal":
      return `height: auto`;
    case "xs":
      factor = 0.5;
      break;
    case "sm":
      factor = 0.75;
      break;
    case "lg":
      factor = 1.25;
      break;
    case "xl":
      factor = 1.5;
      break;
    case "max":
    default:
      return `height: 100%`;
  }
  return `height: ${parseInt(CHART_HEIGHT_BASE, 10) * factor}px;`;
};

// Darken the color, but add a touch of saturation for a more natural shadow look
export function darkenColor(color: any, percent: number) {
  if (color.saturationl() > 10) {
    // If the element has any substantial color to it, then you can mess with the saturation
    return color.darken(percent).saturate(percent).rgb();
    // return saturate(darken(color, percent), percent);
  } else {
    // Otherwise, don't add color where there wasn't any to start with
    return color.darken(percent);
    // return darken(color, percent);
  }
}

// Darken the color, but wash out the color a bit, for a more natural highlighted look
export function lightenColor(color: any, percent: number) {
  if (color.saturationl() > 10) {
    return color.lighten(percent).desaturate(percent).rgb();
  } else {
    // Otherwise, don't add color where there wasn't any to start with
    return color.lighten(percent);
  }
}
