import { render } from "@testing-library/react";
import TabGraph from "./TabGraph";

describe("TabGraph", () => {
  it("matches snapshot", () => {
    const { asFragment } = render(<TabGraph />);
    expect(asFragment()).toMatchSnapshot();
  });
});
