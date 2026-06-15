import styled from "styled-components";

const MetricsGraphDisplay = styled.div`
  align-items: center;
  display: flex;
  flex: 1 1 100%;
  flex-direction: column;
  justify-content: center;
  position: relative;

  @media all and (min-width: 800px) {
    flex: 1 0 60%;
  }
`;

export default MetricsGraphDisplay;
