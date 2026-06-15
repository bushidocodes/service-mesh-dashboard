import React from "react";
import { renderWithIntl } from "utils/i18nTesting";

import GMLineChart from "./GMLineChart";

const props = {
  title: "Classes",
  detailLines: ["Total Loaded: 10,200", "Total Unloaded: 19"],
  dygraph: {
    data: [
      [new Date("Wed Nov 29 2017 18:46:51 GMT-0500 (EST)"), 10181],
      [new Date("Wed Nov 29 2017 18:46:52 GMT-0500 (EST)"), 10181]
    ],
    attributes: ["jvm/classes/current_loaded"]
  },
  expectedAttributes: ["jvm/classes/current_loaded"],
  height: "xs" as const
};

describe("<GMLineChart> stateless child component", () => {
  test("matches snapshot", () => {
    const { asFragment } = renderWithIntl(<GMLineChart {...props} />);
    expect(asFragment()).toMatchSnapshot();
  });
});
