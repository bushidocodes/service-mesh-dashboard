import React, { Component } from "react";
import NotificationSystem from "react-notification-system";
import { createGlobalStyle } from "styled-components";

import {
  NotificationWrapper,
  NotificationBody,
  NotificationTitle
} from "./style";

// Inject our "faux" styled-components that contain
// 3rd party classnames into the global stylesheet
const NotificationGlobalStyles = createGlobalStyle`
${NotificationWrapper};
${NotificationBody};
${NotificationTitle}
`;

export default class Notification extends Component {
  componentDidMount() {
    window.addNotification = this.refs.notificationSystem.addNotification;
  }
  render() {
    // Note: react-notification-system uses style={false} to disable its default
    // inline styles — this is intentional even though it looks unusual.
    return (
      <>
        <NotificationGlobalStyles />
        <NotificationSystem ref="notificationSystem" style={false} />
      </>
    );
  }
}
