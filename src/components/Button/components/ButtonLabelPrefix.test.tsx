import { render } from "@testing-library/react";
import ButtonLabelPrefix from "./ButtonLabelPrefix";

describe("ButtonLabelPrefix", () => {
  it("matches snapshot", () => {
    const { asFragment } = render(<ButtonLabelPrefix />);
    expect(asFragment()).toMatchSnapshot();
  });
});
