import { render } from "@testing-library/react";
import InspectorHideStatic from "./InspectorHideStatic";

describe("InspectorHideStatic", () => {
  it("matches snapshot", () => {
    const { asFragment } = render(<InspectorHideStatic />);
    expect(asFragment()).toMatchSnapshot();
  });
});
