import { renderWithIntl } from "utils/i18nTesting";
import React from "react";
import LanguageSelector from "./LanguageSelector";

describe("LanguageSelector", () => {
  test("matches snapshot", () => {
    const { asFragment } = renderWithIntl(<LanguageSelector />);
    expect(asFragment()).toMatchSnapshot();
  });
});
