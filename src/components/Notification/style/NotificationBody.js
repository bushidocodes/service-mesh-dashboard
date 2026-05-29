import { spacingScale } from "style/styleFunctions";
import {
  NOTIFICATION_BACKGROUND_COLOR,
  FONT_WEIGHT_SEMIBOLD
} from "style/styleVariables";

// Re-theme react-toastify's toast box to the dashboard's flat white card
// (overriding the library's default shadow/radius/text color). The absolutely
// positioned overlay (MessageIcon + DismissButton) anchors to .Toastify__toast,
// which the library already sets to position: relative.
const NotificationBody = `
  .Toastify__toast {
    background-color: ${NOTIFICATION_BACKGROUND_COLOR.string()};
    color: black;
    font-weight: ${FONT_WEIGHT_SEMIBOLD};
    font-size: 14px;
    border-radius: 2px;
    box-shadow: none;
    overflow: hidden;
    min-height: 0;
    padding: ${spacingScale(1)};
  }
  .Toastify__toast-body {
    margin: 0;
    padding: 0;
    align-items: flex-start;
  }
  .notification-message {
    margin: 0;
    padding: 0;
    line-height: 1.4;
  }
`;

export default NotificationBody;
