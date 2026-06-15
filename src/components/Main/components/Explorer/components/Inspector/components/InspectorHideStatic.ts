import styled from "styled-components";

const InspectorHideStatic = styled.input.attrs({
  name: "hideStaticMetric",
  type: "checkbox"
})`
  color: currentColor;
`;

export default InspectorHideStatic;
