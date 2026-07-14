import { render } from "@testing-library/react";
import VizFill from "./VizFill";

describe("VizFill", () => {
  it("matches snapshot", () => {
    const { asFragment } = render(<VizFill />);
    expect(asFragment()).toMatchSnapshot();
  });
});
