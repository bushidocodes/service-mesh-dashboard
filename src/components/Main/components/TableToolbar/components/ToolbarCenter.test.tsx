import { render } from "@testing-library/react";
import ToolbarCenter from "./ToolbarCenter";

describe("ToolbarCenter", () => {
  it("matches snapshot", () => {
    const { asFragment } = render(<ToolbarCenter />);
    expect(asFragment()).toMatchSnapshot();
  });
});
