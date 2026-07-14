import { render } from "@testing-library/react";
import DataPair from "./DataPair";

describe("DataPair", () => {
  it("matches snapshot when priority is primary", () => {
    const { asFragment } = render(<DataPair priority="primary" />);
    expect(asFragment()).toMatchSnapshot();
  });
  it("matches snapshot when priority is normal", () => {
    const { asFragment } = render(<DataPair priority="normal" />);
    expect(asFragment()).toMatchSnapshot();
  });
});
