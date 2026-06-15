import React from "react";

import SecondaryText from "components/SecondaryText";

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
