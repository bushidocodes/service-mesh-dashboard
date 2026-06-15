import styled from "styled-components";

const MessageIconContainer = styled.div`
  position: absolute;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-end;
  pointer-events: none;
  z-index: 0;

  svg {
    /* Icon renders at iconRatio * 24px (= 120px), which overflows the toast.
       Scale it down to a subtle accent that fits the card height. */
    height: 56px;
    width: 56px;
    opacity: 0.05;
  }
`;

export default MessageIconContainer;
