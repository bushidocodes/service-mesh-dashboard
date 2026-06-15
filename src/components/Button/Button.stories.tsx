import React from "react";

import Button from "./Button";

const wrapperStyle = {
  display: "flex",
  width: "100vw",
  justifyContent: "space-around",
  height: "100vh",
  alignItems: "center"
};

const glyphNames = [
  "Bars",
  "Bell",
  "CPU",
  "Card",
  "Cog",
  "Configuration",
  "Docs",
  "EKG",
  "EditGraph",
  "ErrorList",
  "Exclamation",
  "Explorer",
  "Fabric",
  "Finagle",
  "GRPC",
  "GitHub",
  "Http",
  "Info",
  "Instances",
  "JVM",
  "Key",
  "LinkedIn",
  "Memory",
  "Negation",
  "Pause",
  "Person",
  "Play",
  "Poll",
  "Power",
  "Rows",
  "RunningSmall",
  "Scale",
  "Scatterplot",
  "Service",
  "ServiceInstance",
  "ServicesWhite",
  "StarFilled",
  "Summary",
  "Tape",
  "Threads",
  "Timer",
  "ViewCollapse",
  "GET",
  "PUT",
  "POST",
  "DELETE",
  "PATCH"
];

const types = ["danger", "info", "primary", "warning", "polling"] as const;
const outlines = [
  "raised",
  "outline",
  "shadow",
  "none",
  "raised-outline"
] as const;
const sizes = ["normal", "xs", "sm", "lg", "xl"] as const;
const orientations = ["vertical", "horizontal"] as const;

export default {
  title: "Button",
  component: Button,
  argTypes: {
    type: { control: "select", options: types },
    glyph: { control: "select", options: glyphNames },
    glyphColor: { control: "color" },
    glyphRatio: { control: "number" },
    orientation: { control: "select", options: orientations },
    outline: { control: "select", options: outlines },
    size: { control: "select", options: sizes },
    active: { control: "boolean" },
    disabled: { control: "boolean" },
    label: { control: "text" },
    prefix: { control: "text" },
    suffix: { control: "text" },
    tabIndex: { control: "number" }
  }
};

const Wrapped = (args: any) => (
  <div style={wrapperStyle}>
    <Button {...args} />
  </div>
);

export const Default = {
  render: Wrapped,
  args: {
    active: false,
    label: "Hello World",
    orientation: "horizontal",
    outline: "none",
    size: "normal",
    glyphRatio: 1,
    disabled: false,
    clickAction: () => alert("clicked")
  }
};

export const Types = {
  render: () => (
    <div style={wrapperStyle}>
      {types.map((type) => (
        <Button type={type} label={type} key={type} clickAction={() => {}} />
      ))}
    </div>
  )
};

export const Sizes = {
  render: () => (
    <div style={wrapperStyle}>
      {sizes.map((size) => (
        <Button size={size} label={size} key={size} clickAction={() => {}} />
      ))}
    </div>
  )
};

export const Outlines = {
  render: () => (
    <div style={wrapperStyle}>
      {outlines.map((outline) => (
        <Button
          outline={outline}
          label={outline}
          key={outline}
          clickAction={() => {}}
        />
      ))}
    </div>
  )
};

export const Orientations = {
  render: () => (
    <div style={wrapperStyle}>
      {orientations.map((orientation) => (
        <Button
          glyph="Bell"
          orientation={orientation}
          label={orientation}
          clickAction={() => {}}
          key={orientation}
        />
      ))}
    </div>
  )
};
