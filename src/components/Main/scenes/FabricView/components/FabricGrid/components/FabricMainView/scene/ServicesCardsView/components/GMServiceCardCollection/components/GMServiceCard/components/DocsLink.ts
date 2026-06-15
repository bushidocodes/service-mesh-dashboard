import styled from "styled-components";

// pseudo element is added to expand clickable area of 'Docs' Icon on services card
const DocsLink = styled.a<{ cardFontColor?: string }>`
  display: inline-block;
  justify-self: flex-end;
  margin-left: 0;
  cursor: pointer;
  pointer-events: auto;
  color: ${(props) => props.cardFontColor};
  transition: all 0.3s ease;
  transform: scale(1);
  will-change: transform;
  position: relative;

  &:hover,
  &:focus {
    transform: scale(1.25);
    transition: all 0.1s ease;
    color: inherit;
  }

  &:active {
    transform: scale(1.1);
  }

  &:after {
    content: "";
    display: block;
    position: absolute;
    top: -4px;
    bottom: -14px;
    left: -4px;
    right: -14px;
  }
`;

export default DocsLink;
