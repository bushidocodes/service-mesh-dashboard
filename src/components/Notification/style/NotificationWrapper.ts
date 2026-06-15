import { NOTIFICATION_WIDTH } from "style/styleVariables";

// react-toastify owns the fixed positioning + enter/exit animation of the
// container; we only constrain its width to the dashboard's notification width.
const NotificationWrapper = `
  .Toastify__toast-container {
    width: ${NOTIFICATION_WIDTH};
    padding: 0;
  }
`;

export default NotificationWrapper;
