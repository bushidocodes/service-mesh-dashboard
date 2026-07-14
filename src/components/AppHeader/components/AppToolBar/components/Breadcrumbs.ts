import { hide } from "components/globalPatterns";
import styled from "styled-components";

const Breadcrumbs = styled.ol<{ hideRoot?: boolean }>`
  align-items: stretch;
  display: flex;
  flex: 1 1 auto;
  flex-direction: row;
  height: inherit;
  margin: 0;
  padding: 0;

  > li:first-child {
    ${(props) => (props.hideRoot ? hide : "")};
  }
`;

export default Breadcrumbs;
