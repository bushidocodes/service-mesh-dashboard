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
    // Note: React Notification uses an unusual syntax for disabling
    // default styles, which forces us to overtime this eslint rule
    // eslint-disable-next-line react/style-prop-object
    return <NotificationSystem ref="notificationSystem" style={false} />;
  }
}
