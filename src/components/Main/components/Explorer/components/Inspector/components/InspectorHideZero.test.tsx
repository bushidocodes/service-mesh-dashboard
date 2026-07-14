import { render } from "@testing-library/react";
import InspectorHideZero from "./InspectorHideZero";

describe("InspectorHideZero", () => {
  it("matches snapshot", () => {
    const { asFragment } = render(<InspectorHideZero />);
    expect(asFragment()).toMatchSnapshot();
  });
});
