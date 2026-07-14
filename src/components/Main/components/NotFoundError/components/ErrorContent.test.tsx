import { render } from "@testing-library/react";
import ErrorContent from "./ErrorContent";

describe("ErrorContent", () => {
  it("matches snapshot", () => {
    const { asFragment } = render(<ErrorContent />);
    expect(asFragment()).toMatchSnapshot();
  });
});
