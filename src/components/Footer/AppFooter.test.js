import React from "react";
import { renderWithIntl } from "utils/i18nTesting";
import FooterContainer from "./index.js";

describe("A Footer container", () => {
  it("should render", () => {
    const { asFragment } = renderWithIntl(<FooterContainer />);
    expect(asFragment()).toMatchSnapshot();
  });
});
