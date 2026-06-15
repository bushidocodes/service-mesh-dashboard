import styled from "styled-components";

const StyledG = styled.g.attrs({
  fill: "currentColor"
})<{ ratio?: string | number; title?: string }>`
  transform: scale(${(props) => props.ratio});
`;

export default StyledG;
