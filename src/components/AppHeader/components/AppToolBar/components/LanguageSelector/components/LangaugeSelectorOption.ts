import styled from "styled-components";
import { COLOR_BRAND_PRIMARY } from "style/styleVariables";

const LanguageOption = styled.li`
  padding: 5px 0;
  list-style-type: none;
  :hover {
    color: ${COLOR_BRAND_PRIMARY.toString()};
  }
`;

export default LanguageOption;
