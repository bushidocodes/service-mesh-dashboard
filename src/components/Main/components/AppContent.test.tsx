import React from "react";
import { render } from "@testing-library/react";
import AppContent from "./AppContent";

describe("AppContent", () => {
  it("matches snapshot", () => {
    const { asFragment } = render(<AppContent />);
    expect(asFragment()).toMatchSnapshot();
  });
});
