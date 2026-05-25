import styled from "styled-components";

import { COLOR_ALT_BACKGROUND } from "style/styleVariables";

import BannerBackgroundImage from "images/mesh-long.png";

const AppHeaderContainer = styled.div`
  display: flex;
  flex: 0 0 auto;
  flex-direction: column;
  align-items: stretch;
  background-image:
    linear-gradient(
      to right,
      rgba(0, 0, 0, 0.7),
      rgba(0, 0, 0, 0),
      rgba(0, 0, 0, 0)
    ),
    url(${BannerBackgroundImage});
  background-size:
    100% 100%,
    auto auto;
  background-repeat: no-repeat, no-repeat;
  background-position:
    top left,
    top -30px right 20%;
  background-color: ${COLOR_ALT_BACKGROUND.string()};
`;

export default AppHeaderContainer;
