import { Link } from "react-router-dom";
import { COLOR_CONTENT_MUTED, COLOR_HIGHLIGHT } from "style/styleVariables";
import styled from "styled-components";

// Wrap Link in a plain function component so styled-components v2 can wrap it.
// React Router v6 exports Link as a forwardRef object (typeof === "object").
function LinkWrapper(props: any) {
  return <Link {...props} />;
}

const GMLink = styled(LinkWrapper)<{ cursor?: string; disabled?: boolean }>`
  width: 100%;
  cursor: ${(props) => (props.cursor ? props.cursor : "pointer")};
  text-decoration: none;
  color: black;
  display: flex;

  &:focus {
    outline: -webkit-focus-ring-color auto 5px;
  }

  &:hover {
    ${(props) =>
      props.disabled
        ? `
        color: ${COLOR_CONTENT_MUTED.string()};
        cursor: not-allowed;
    `
        : `
        color: ${COLOR_HIGHLIGHT.string()};
    `};
  }

  &:focus:active:hover {
    outline: 0;
  }

  ${(props) =>
    props.disabled &&
    `
      color: ${COLOR_CONTENT_MUTED.string()};
      cursor: not-allowed;

  `};
`;

export default GMLink;
