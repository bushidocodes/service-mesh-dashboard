import { render } from "@testing-library/react";
import ButtonWrap from "./ButtonWrap";

describe("ButtonWrap", () => {
  it("should match snapshot", () => {
    const { asFragment } = render(<ButtonWrap />);
    expect(asFragment()).toMatchSnapshot();
  });
});
