import { render } from "@testing-library/react";
import ReadoutItemGraph from "./ReadoutItemGraph";

describe("ReadoutItemGraph", () => {
  it("matches snapshot", () => {
    const { asFragment } = render(<ReadoutItemGraph />);
    expect(asFragment()).toMatchSnapshot();
  });
});
