import { render } from "@testing-library/react";
import AppVersionLink from "./AppVersionLink";

describe("AppVersionLink", () => {
  it("matches snapshot", () => {
    const { asFragment } = render(<AppVersionLink />);
    expect(asFragment()).toMatchSnapshot();
  });
});
