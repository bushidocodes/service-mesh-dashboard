import React, { Component } from "react";
import NotificationSystem from "react-notification-system";
import { injectGlobal } from "styled-components";

import {
  NotificationWrapper,
  NotificationBody,
  NotificationTitle
} from "./style";

// Inject our "faux" styled-components that contain
// 3rd party classnames into the global stylesheet
injectGlobal`
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
    return <NotificationSystem ref="notificationSystem" style={false} />;
  }
}
