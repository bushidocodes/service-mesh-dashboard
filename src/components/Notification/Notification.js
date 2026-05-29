import React from "react";
import { ToastContainer } from "react-toastify";
import { createGlobalStyle } from "styled-components";

import "react-toastify/dist/ReactToastify.css";

import {
  NotificationWrapper,
  NotificationBody,
  NotificationTitle
} from "./style";

// Inject our "faux" styled-components that contain react-toastify's
// classnames into the global stylesheet, re-theming the default toast to
// match the dashboard (flat white card, our fonts, our dismiss/icon overlay).
const NotificationGlobalStyle = createGlobalStyle`
${NotificationWrapper};
${NotificationBody};
${NotificationTitle}
`;

// reportError() (services/notification) calls the imperative toast() API, so
// no ref/window global is needed — toasts queue until this container mounts.
// icon/closeButton are disabled here because our toast content renders its own
// faint MessageIcon and DismissButton overlay (see services/notification).
export default function Notification() {
  return (
    <React.Fragment>
      <NotificationGlobalStyle />
      <ToastContainer position="top-center" icon={false} closeButton={false} />
    </React.Fragment>
  );
}
