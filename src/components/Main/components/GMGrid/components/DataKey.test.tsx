import { render } from "@testing-library/react";
import DataKey from "./DataKey";

describe("DataKey", () => {
  it("matches snapshot", () => {
    const { asFragment } = render(<DataKey />);
    expect(asFragment()).toMatchSnapshot();
  });
});
