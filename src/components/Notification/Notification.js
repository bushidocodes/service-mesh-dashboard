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
const NotificationGlobalStyle = createGlobalStyle`
${NotificationWrapper};
${NotificationBody};
${NotificationTitle}
`;

export default class Notification extends Component {
  constructor(props) {
    super(props);
    this.notificationSystem = React.createRef();
  }
  componentDidMount() {
    window.addNotification = this.notificationSystem.current.addNotification;
  }
  render() {
    // Note: react-notification-system uses style={false} to disable its default
    // inline styles — this is intentional even though it looks unusual.
    return (
      <React.Fragment>
        <NotificationGlobalStyle />
        <NotificationSystem ref={this.notificationSystem} style={false} />
      </React.Fragment>
    );
  }
}
