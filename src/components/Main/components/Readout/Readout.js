import React from "react";
import { PropTypes } from "prop-types";

import ReadoutDisplay from "./components/ReadoutDisplay";
import ReadoutItem, { ReadoutItemShape } from "./components/ReadoutItem";

export default function Readout({
  cacheCard,
  children,
  primary,
  readoutItems = []
}) {
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

Readout.propTypes = {
  cacheCard: PropTypes.bool,
  children: PropTypes.element,
  primary: PropTypes.bool,
  readoutItems: PropTypes.oneOfType([
    PropTypes.arrayOf(ReadoutItemShape),
    PropTypes.object
  ])
};
