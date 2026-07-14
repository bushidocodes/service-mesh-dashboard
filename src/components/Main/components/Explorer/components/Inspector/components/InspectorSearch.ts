import { form_control } from "components/globalPatterns";

import { COLOR_HIGHLIGHT, COLOR_WHITE } from "style/styleVariables";
import styled from "styled-components";

const InspectorSearch = styled.input`
  ${form_control};
  appearance: none;
  margin: 8px;

  box-shadow:
    inset 0 0 0 rgba(0, 0, 0, 0),
    0 0 0 rgba(0, 0, 0, 0),
    0 0 0 rgba(0, 0, 0, 0);
  text-align: left;
  user-select: auto;
  width: calc(100% - 16px);

  &[type="text"],
  &[type="search"] {
    cursor: text;

    &:focus {
      &::placeholder {
        opacity: 0;
      }
    }
  }

  &::placeholder {
    color: currentColor;
    opacity: 1;
    text-align: center;
  }

  &::-ms-expand {
    background-color: transparent;
    border: 0;
  }

  &:focus {
    box-shadow:
      inset 0 0 0 rgba(255, 255, 255, 0.5),
      0 0 0 1px ${COLOR_HIGHLIGHT.mix(COLOR_WHITE, 0.25).string()},
      0 0 0 4px ${COLOR_HIGHLIGHT.mix(COLOR_WHITE, 0.75).string()};
    outline: none;
  }
`;

export default InspectorSearch;
