import { render } from "@testing-library/react";
import LineChartTitle from "./LineChartTitle";

describe("LineChartTitle", () => {
  it("matches snapshot", () => {
    const { asFragment } = render(<LineChartTitle />);
    expect(asFragment()).toMatchSnapshot();
  });
});
