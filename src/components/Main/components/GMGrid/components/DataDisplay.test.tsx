import { render } from "@testing-library/react";
import DataDisplay from "./DataDisplay";

describe("DataDisplay", () => {
  it("matches snapshot when table is false", () => {
    const { asFragment } = render(<DataDisplay table={false} />);
    expect(asFragment()).toMatchSnapshot();
  });
  it("matches snapshot when table is true", () => {
    const { asFragment } = render(<DataDisplay table={true} />);
    expect(asFragment()).toMatchSnapshot();
  });
});
