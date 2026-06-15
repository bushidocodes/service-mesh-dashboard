import React from "react";

import ReadoutDisplay from "./components/ReadoutDisplay";
import ReadoutItem from "./components/ReadoutItem";
import type { ReadoutItemData } from "./components/ReadoutItem";

interface ReadoutProps {
  cacheCard?: boolean;
  children?: React.ReactElement;
  primary?: boolean;
  readoutItems?: ReadoutItemData[];
}

export default function Readout({
  cacheCard,
  children,
  primary,
  readoutItems = []
}: ReadoutProps) {
  return (
    <ReadoutDisplay primary={primary} cacheCard={cacheCard}>
      {readoutItems.map((item) => (
        <ReadoutItem
          key={`${item.title}|${item.value}|${item.detail}`}
          {...item}
          cacheCard={cacheCard}
        />
      ))}
    </ReadoutDisplay>
  );
}
