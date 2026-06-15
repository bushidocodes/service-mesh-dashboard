import styled from "styled-components";

import { spacingScale } from "style/styleFunctions";

const Line = styled.div`
  display: flex;
  min-height: ${spacingScale(4)};
  flex-direction: row;
  width: 100%;
  padding: 0 ${spacingScale(2)};
`;

const LineLeft = styled.div`
  flex: 1 1 auto;
  display: flex;
  padding-left: ${spacingScale(4)};
  align-items: center;
`;

const LineRight = styled.div`
  flex: 0 1 auto;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  text-align: right;
`;

export { Line, LineLeft, LineRight };
