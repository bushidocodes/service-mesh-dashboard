import { render } from "@testing-library/react";
import ErrorBox from "./ErrorBox";

describe("ErrorBox", () => {
  it("matches snapshot", () => {
    const { asFragment } = render(<ErrorBox />);
    expect(asFragment()).toMatchSnapshot();
  });
});
