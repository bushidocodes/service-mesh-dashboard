import React from "react";
import { MemoryRouter } from "react-router-dom";
import { screen } from "@testing-library/react";

import { renderWithIntl } from "utils/i18nTesting";

import AppToolBar from "./AppToolBar";

describe("AppToolBar breadcrumbs", () => {
  // Regression test for CodeQL js/incomplete-sanitization (alert #5): the
  // pathname-decoding step used a string-argument .replace("%2F", "/"), which
  // only swaps the FIRST escaped slash. A path with several encoded slashes was
  // therefore split into the wrong breadcrumb segments.
  test("decodes every %2F-escaped slash, not just the first", () => {
    renderWithIntl(
      <MemoryRouter>
        <AppToolBar pathname="alpha%2Fbravo%2Fcharlie" />
      </MemoryRouter>
    );

    // Each decoded segment becomes its own breadcrumb link.
    expect(screen.getByRole("link", { name: "alpha" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "bravo" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "charlie" })).toBeInTheDocument();

    // With the old single-replace bug a breadcrumb kept a literal "%2F"
    // (e.g. "bravo%2Fcharlie"); assert none survives.
    expect(screen.queryByText(/%2F/i)).not.toBeInTheDocument();
  });
});
