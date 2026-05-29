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
    /* With icon/closeButton disabled, our title + message are direct flex
       children of the toast, which toastify lays out as a centered row. Stack
       them vertically so the "ERROR" title sits above the message (instead of
       being squashed into a narrow side column). */
    flex-direction: column;
  }
  /* toastify's own (more specific) rule keeps align-items: center on the toast,
     so stretch the children to full width to left-align both the title and the
     message rather than fighting that specificity. */
  .notification-title,
  .notification-message {
    align-self: stretch;
    width: 100%;
    margin: 0;
    padding: 0;
  }
  .notification-message {
    line-height: 1.4;
  }
`;

export default NotificationBody;
