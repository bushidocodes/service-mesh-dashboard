import { form_control } from "components/globalPatterns";

import Magnifier from "images/icons/magnifier.svg";
import styled from "styled-components";

const SearchInput = styled.input.attrs({
  type: "search"
})`
  background-image: url(${Magnifier});
  background-repeat: no-repeat;
  background-size: contain;
  position: relative;
  text-indent: 20px;
  &::-webkit-search-cancel-button {
    cursor: pointer;
  }
  ${form_control};
`;

export default SearchInput;
