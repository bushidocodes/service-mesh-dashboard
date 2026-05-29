import React from "react";

import { renderWithIntl } from "utils/i18nTesting";
import ThreadsTable from "./index";

describe("ThreadsTable component", () => {
  test("matches the snapshot", () => {
    const { asFragment } = renderWithIntl(<ThreadsTable />);
    expect(asFragment()).toMatchSnapshot();
  });
});
