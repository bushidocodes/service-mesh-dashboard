import React from "react";
import { components } from "react-select";

interface GMSelectSingleValueProps {
  data: Record<string, unknown>;
  selectProps: {
    valueRenderer: (...args: any[]) => any;
  };
  [key: string]: any;
}

export default function GMSelectSingleValue({
  data,
  selectProps,
  ...svProps
}: GMSelectSingleValueProps) {
  const SingleValue = components.SingleValue as any;
  return (
    <SingleValue {...svProps}>{selectProps.valueRenderer(data)}</SingleValue>
  );
}
