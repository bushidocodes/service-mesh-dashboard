import SecondaryText from "components/SecondaryText";
import React from "react";

interface GMSelectValueRendererProps {
  title: string;
  val: Record<string, any>;
}

export default function GMSelectValueRenderer({
  title,
  val
}: GMSelectValueRendererProps) {
  return (
    <span>
      <span>{title} </span>
      <SecondaryText>{val.label}</SecondaryText>
    </span>
  );
}
