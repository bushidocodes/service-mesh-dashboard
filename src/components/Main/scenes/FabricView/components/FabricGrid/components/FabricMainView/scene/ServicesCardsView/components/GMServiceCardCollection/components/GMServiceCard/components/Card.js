import { PADDING_BASE, FONT_SIZE_SM } from "style/styleVariables";
import { PropTypes } from "prop-types";

import Color from "color";
import styled from "styled-components";

const CARD_SPACING = PADDING_BASE;
const CARD_INTERACTION_SCALE = 1.05;

export const CardContainer = styled.div`
  color: ${(props) => props.cardFontColor};
  background-color: ${(props) => Color(props.cardBackgroundColor).string()};
  border: 1px solid ${(props) => props.cardBorderColor};
  border-top: 2px solid ${(props) => props.cardBorderAltColor};
  width: 100%;
  border-radius: 1px;
  height: ${(props) => props.height};
  margin: ${parseInt(CARD_SPACING, 10) / 2}px;
  padding: ${parseInt(PADDING_BASE, 10) * 1.5}px
    ${parseInt(PADDING_BASE, 10) * 1.5}px ${parseInt(PADDING_BASE, 10)}px;
  font-size: ${FONT_SIZE_SM};
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  position: relative;

  @media all and (min-width: 375px) {
    width: calc((100% / 2) - ${CARD_SPACING});
  }
  @media all and (min-width: 530px) {
    width: calc((100% / 3) - ${CARD_SPACING});
  }
  @media all and (min-width: 704px) {
    width: calc((100% / 4) - ${CARD_SPACING});
  }
  @media all and (min-width: 875px) {
    width: calc((100% / 5) - ${CARD_SPACING});
  }
  @media all and (min-width: 1040px) {
    width: calc((100% / 6) - ${CARD_SPACING});
  }
  @media all and (min-width: 1208px) {
    width: calc((100% / 7) - ${CARD_SPACING});
  }

  a {
    color: inherit;
  }

  ${(props) =>
    props.isAccessible &&
    `
    background-image: none;
    transition: all 0.4s ease;

    .background-icon,
    a,
    h1,
    footer {
      transition: inherit;
    }

    &:hover,
    &:focus {
      transform: scale(${CARD_INTERACTION_SCALE});
      transition: all 0.1s ease;

      h1,
      footer {
        transform: scale(calc(1/${CARD_INTERACTION_SCALE})) translate3d(0,0,0);
      }

      .background-icon {
        transform: scale(${CARD_INTERACTION_SCALE});
      }
    }

    &:active {
      transform: scale(${parseInt(CARD_INTERACTION_SCALE, 10) * 0.95});
      transition: all 0 ease;
    }
  `};
`;

CardContainer.propTypes = {
  cardBackgroundColor: PropTypes.string,
  cardBorderAltColor: PropTypes.string,
  cardBorderColor: PropTypes.string,
  cardFontColor: PropTypes.string,
  height: PropTypes.string,
  isAccessible: PropTypes.bool
};

export const CardFooter = styled.footer`
  display: flex;
  align-items: center;
  font-weight: ${parseInt((props) => props.cardFontWeight, 10)};
  justify-content: space-between;
  z-index: 10;
  position: relative;
  pointer-events: none;
  letter-spacing: 0.03em;

  > a,
  > svg {
    pointer-events: auto;
  }

  > a:last-child {
    margin-right: -0.5em;
  }

  > svg:first-child {
    margin-left: -0.5em;
  }
`;

CardFooter.propTypes = {
  cardFontWeight: PropTypes.string
};
