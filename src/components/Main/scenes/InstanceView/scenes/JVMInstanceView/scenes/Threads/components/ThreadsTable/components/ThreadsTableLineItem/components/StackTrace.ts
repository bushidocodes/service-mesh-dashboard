import styled from "styled-components";

import { spacingScale, contentTypeCode } from "style/styleFunctions";

/* Set a counter named 'section', and it`s initial value is 0. */
const StackTrace = styled.div`
  counter-reset: stack-trace;
  word-break: break-all;

  > div:not(:first-child) {
    counter-increment: stack-trace;
    position: relative;
    margin-left: 1.5em;

    &:before {
      content: counter(stack-trace);
      position: absolute;
      text-align: right;
      width: 5em;
      right: calc(100% + ${spacingScale(1)});
      top: 0;
      opacity: 0.25;
    }
  }

  ${contentTypeCode()};
`;

export default StackTrace;
