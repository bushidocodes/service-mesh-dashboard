import { render } from "@testing-library/react";
import LineChartDetails from "./LineChartDetails";

describe("LineChartDetails", () => {
  it("matches snapshot", () => {
    const { asFragment } = render(<LineChartDetails />);
    expect(asFragment()).toMatchSnapshot();
  });
});
