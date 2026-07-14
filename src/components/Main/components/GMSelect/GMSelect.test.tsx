import { render } from "@testing-library/react";
import GMSelect from "./GMSelect";

describe("GMSelect", () => {
  it("matches snapshot", () => {
    const { asFragment } = render(<GMSelect />);
    expect(asFragment()).toMatchSnapshot();
  });
});
