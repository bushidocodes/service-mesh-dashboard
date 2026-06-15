import React from "react";

import Icon from "./Icon";

import Glyph from "../Glyphs";

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

const wrapperStyle: React.CSSProperties = {
  display: "flex",
  width: "100vw",
  padding: "150px",
  flexWrap: "wrap",
  height: "100vh"
};

// dynamic glyph name is used for story knob testing only.
// call the glyph component by name specifically, <CardGlyph> instead of <Glyph name="CardGlyph"> for code implementation

export default {
  title: "Icons",
  component: Icon
};

export const Default = {
  render: () => {
    const glyphName = "Card";

    return (
      <Icon
        glyphName={glyphName}
        backgroundStyle="BackgroundSquare"
        backgroundColor="#f00"
        backgroundOpacity={0.5}
        borderStyle="BorderSquare"
        borderColor="currentColor"
        borderOpacity={0.5}
        iconRatio={1}
        glyphColor="currentColor"
        glyphRatio={1}
        transform={""}
      >
        <Glyph name={glyphName} />
      </Icon>
    );
  }
};

export const Gallery = {
  render: () => (
    <div style={wrapperStyle}>
      {glyphNames.map((glyph) => {
        return (
          <Icon glyphName={glyph} key={glyph}>
            <Glyph name={glyph} />
          </Icon>
        );
      })}
    </div>
  )
};
