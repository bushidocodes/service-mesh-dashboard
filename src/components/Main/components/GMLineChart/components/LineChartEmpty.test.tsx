import { render } from "@testing-library/react";
import LineChartEmpty from "./LineChartEmpty";

describe("LineChartEmpty", () => {
  it("matches snapshot", () => {
    const { asFragment } = render(<LineChartEmpty />);
    expect(asFragment()).toMatchSnapshot();
  });
});
