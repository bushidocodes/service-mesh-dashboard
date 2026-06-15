import React from "react";

import StatusIcon from "./StatusIcon";

export default {
  title: "Status Icon",
  component: StatusIcon
};

export const Down = {
  render: () => <StatusIcon status="down" />
};

export const Stable = {
  render: () => <StatusIcon status="stable" />
};

export const Warning = {
  render: () => <StatusIcon status="warning" />
};
