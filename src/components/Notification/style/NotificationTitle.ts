import { spacingScale } from "style/styleFunctions";
import {
  FONT_SIZE_SM,
  FONT_STACK_DATA,
  FONT_WEIGHT_REGULAR
} from "style/styleVariables";

const NotificationTitle = `
  .notification-title {
    margin: 0 0 ${spacingScale(1)};
    font-weight: ${FONT_WEIGHT_REGULAR};
    text-transform: uppercase;
    letter-spacing: 0.15em;
    font-size: ${FONT_SIZE_SM};
    font-family: ${FONT_STACK_DATA};
    padding: 0;
  }
`;

export default NotificationTitle;
