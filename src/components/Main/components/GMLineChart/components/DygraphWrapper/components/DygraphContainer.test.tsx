import { render } from "@testing-library/react";
import DygraphContainer from "./DygraphContainer";

describe("DygraphContainer", () => {
  it("matches snapshot", () => {
    const { asFragment } = render(<DygraphContainer />);
    expect(asFragment()).toMatchSnapshot();
  });
});
