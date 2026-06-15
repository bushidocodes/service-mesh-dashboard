import React from "react";

interface DocsIconProps {
  fillColor?: string;
}

/**
 * Takes string fillColor and returns "Docs" icon
 *
 * @export
 * @param {string} { fillColor = "black" }
 * @returns
 */
export default function DocsIcon({ fillColor = "black" }: DocsIconProps) {
  return (
    <svg
      width="13px"
      height="17px"
      viewBox="0 0 13 17"
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
    >
      <defs>
        <path
          d="M8,5 L19,5 L19,22 L6,22 L6,7 L6,7 C6,5.8954305 6.8954305,5 8,5 L8,5 Z M8,6 C7.44771525,6 7,6.44771525 7,7 L7,21 L18,21 L18,6 L8,6 Z M8.5,8 L11.5,8 C11.7761424,8 12,8.22385763 12,8.5 C12,8.77614237 11.7761424,9 11.5,9 L8.5,9 C8.22385763,9 8,8.77614237 8,8.5 C8,8.22385763 8.22385763,8 8.5,8 Z M8.5,11 L16.5,11 C16.7761424,11 17,11.2238576 17,11.5 C17,11.7761424 16.7761424,12 16.5,12 L8.5,12 C8.22385763,12 8,11.7761424 8,11.5 C8,11.2238576 8.22385763,11 8.5,11 Z M8.5,13 L16.5,13 C16.7761424,13 17,13.2238576 17,13.5 C17,13.7761424 16.7761424,14 16.5,14 L8.5,14 C8.22385763,14 8,13.7761424 8,13.5 C8,13.2238576 8.22385763,13 8.5,13 Z M8.5,15 L16.5,15 C16.7761424,15 17,15.2238576 17,15.5 C17,15.7761424 16.7761424,16 16.5,16 L8.5,16 C8.22385763,16 8,15.7761424 8,15.5 C8,15.2238576 8.22385763,15 8.5,15 Z M8.5,17 L16.5,17 C16.7761424,17 17,17.2238576 17,17.5 C17,17.7761424 16.7761424,18 16.5,18 L8.5,18 C8.22385763,18 8,17.7761424 8,17.5 C8,17.2238576 8.22385763,17 8.5,17 Z"
          id="path-1"
        />
      </defs>
      <g
        id="Glyphs"
        stroke="none"
        strokeWidth="1"
        fill="none"
        fillRule="evenodd"
      >
        <g id="Glyphs-/-Docs" transform="translate(-6.000000, -5.000000)">
          <mask id="mask-2" fill="white">
            <use xlinkHref="#path-1" />
          </mask>
          <g id="Icon" />
          <g
            id="Colors-/-Brand-/-Green-/-Primary"
            mask="url(#mask-2)"
            fill={fillColor}
          >
            <rect id="Color" x="0" y="0" width="26" height="27" />
          </g>
        </g>
      </g>
    </svg>
  );
}
