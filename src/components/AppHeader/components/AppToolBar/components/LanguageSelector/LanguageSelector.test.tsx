import React from "react";
import { renderWithIntl } from "utils/i18nTesting";
import LanguageSelector from "./LanguageSelector";

describe("LanguageSelector", () => {
  test("matches snapshot", () => {
    const { asFragment } = renderWithIntl(<LanguageSelector />);
    expect(asFragment()).toMatchSnapshot();
  });
});
