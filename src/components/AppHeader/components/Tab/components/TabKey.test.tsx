import { render } from "@testing-library/react";
import TabKey from "./TabKey";

describe("TabKey", () => {
  it("matches snapshot", () => {
    const { asFragment } = render(<TabKey />);
    expect(asFragment()).toMatchSnapshot();
  });
});
