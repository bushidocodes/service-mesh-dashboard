import { render } from "@testing-library/react";
import InspectorData from "./InspectorData";

describe("InspectorData", () => {
  it("matches snapshot", () => {
    const { asFragment } = render(<InspectorData />);
    expect(asFragment()).toMatchSnapshot();
  });
});
