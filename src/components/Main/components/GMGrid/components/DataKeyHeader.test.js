import React from "react";
import { render } from "@testing-library/react";
import DataKeyHeader from "./DataKeyHeader";

describe("DataKeyHeader", () => {
  it("matches snapshot", () => {
    const { asFragment } = render(<DataKeyHeader />);
    expect(asFragment()).toMatchSnapshot();
  });
});
