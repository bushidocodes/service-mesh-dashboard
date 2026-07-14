import { render } from "@testing-library/react";
import React from "react";
import DygraphWrapper from "./DygraphWrapper";

const dygraph = {
  data: [
    [new Date("Thu Dec 21 2017 10:35:51 GMT-0500 (EST)"), 10181],
    [new Date("Thu Dec 21 2017 10:35:56 GMT-0500 (EST)"), 1081],
    [new Date("Thu Dec 21 2017 10:36:56 GMT-0500 (EST)"), 2091],
    [new Date("Thu Dec 21 2017 10:37:56 GMT-0500 (EST)"), 10021]
  ],
  attributes: ["Time", "# of currently loaded JVM Classes"]
};

describe("DygraphWrapper", () => {
  it("matches default snapshot", () => {
    const { asFragment } = render(<DygraphWrapper dygraph={dygraph} />);
    expect(asFragment()).toMatchSnapshot();
  });
});
